mod nft_metadata;
use anchor_lang::prelude::*;
use anchor_spl::{ associated_token::AssociatedToken, token::{ Token, spl_token } };
mod build_metadata;

declare_id!("CsFsWk5NwBuo7bGbryvyujzrtMnz6458EphQ5xytMMpM");

#[program]
pub mod contract {
    use anchor_lang::solana_program::program::{ invoke, invoke_signed };
    use anchor_lang::solana_program::system_instruction::{ self };
    use anchor_spl::token::{ mint_to, MintTo };

    use crate::build_metadata::build_metadata_ix;

    use super::*;

    pub fn book_slot(ctx: Context<BookSlot>, start_time: i64) -> Result<()> {
        let experience_key = ctx.accounts.experience.key();
        let slot = &mut ctx.accounts.slot;
        let slot_price = slot.price;

        require!(!slot.is_booked, ErrorCode::AlreadyBooked);
        require!(**ctx.accounts.user.lamports.borrow() >= slot_price, ErrorCode::InsufficientFunds);

        // Transfer payment to organiser
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.user.key(),
                &ctx.accounts.organiser.key(),
                slot_price
            ),
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.organiser.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ]
        )?;

        slot.is_booked = true;

        // Set reservation fields
        let reservation = &mut ctx.accounts.reservation;
        reservation.experience_id = experience_key;
        reservation.user = ctx.accounts.user.key();
        reservation.time_slot = start_time;
        reservation.nft_mint = ctx.accounts.mint.key();
        reservation.start_time = slot.start_time;
        reservation.end_time = slot.end_time;
        reservation.is_active = true;

        // Mint account creation
        let mint_rent = Rent::get()?.minimum_balance(82);
        invoke(
            &system_instruction::create_account(
                &ctx.accounts.user.key(),
                &ctx.accounts.mint.key(),
                mint_rent,
                82,
                &ctx.accounts.token_program.key()
            ),
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.mint.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ]
        )?;

        // Initialize mint
        let mint_ix = spl_token::instruction::initialize_mint(
            &ctx.accounts.token_program.key(),
            &ctx.accounts.mint.key(),
            &ctx.accounts.user.key(),
            Some(&ctx.accounts.user.key()),
            0
        )?;
        invoke(
            &mint_ix,
            &[
                ctx.accounts.mint.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.rent.to_account_info(),
            ]
        )?;

        // Create ATA (associated token account)
        let cpi_ctx = CpiContext::new(
            ctx.accounts.associated_token_program.to_account_info(),
            anchor_spl::associated_token::Create {
                payer: ctx.accounts.user.to_account_info(),
                associated_token: ctx.accounts.user_nft_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                token_program: ctx.accounts.token_program.to_account_info(),
            }
        );
        anchor_spl::associated_token::create(cpi_ctx)?;

        // Mint 1 token (NFT)
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.user_nft_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        });
        mint_to(cpi_ctx, 1)?;

        // ✅ Use lightweight URI instead of full inline JSON
        let metadata_uri = nft_metadata::create_metadata_uri(
            &ctx.accounts.experience,
            slot.start_time,
            slot.end_time
        );

        let symbol = ctx.accounts.experience.title.chars().take(10).collect::<String>();
        let ix = build_metadata_ix(&ctx, metadata_uri, symbol);

        invoke_signed(
            &ix,
            &[
                ctx.accounts.metadata_program.to_account_info(),
                ctx.accounts.metadata.to_account_info(),
                ctx.accounts.mint.to_account_info(),
                ctx.accounts.user.to_account_info(),
                ctx.accounts.user_nft_account.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
                ctx.accounts.token_program.to_account_info(),
                ctx.accounts.rent.to_account_info(),
                ctx.accounts.sysvar_instructions.to_account_info(),
                ctx.accounts.master_edition.to_account_info(),
            ],
            &[] // Optional: seeds if authority is PDA
        )?;

        emit!(ReservationCreated {
            user: ctx.accounts.user.key(),
            reservation: ctx.accounts.reservation.key(),
            nft_mint: ctx.accounts.mint.key(),
            start_time,
        });

        Ok(())
    }

    // function to create an experience
    pub fn create_experience(
        ctx: Context<CreateExperience>,
        title: String,
        location: String,
        description: String,
        price_lamports: u64
    ) -> Result<()> {
        let experience = &mut ctx.accounts.experience;

        require!(title.len() <= Experience::MAX_TITLE_LEN, ErrorCode::TitleTooLong);
        require!(title.len() > 0, ErrorCode::TitleEmpty);
        require!(location.len() <= Experience::MAX_LOCATION_LEN, ErrorCode::LocationTooLong);
        require!(location.len() > 0, ErrorCode::LocationEmpty);
        require!(price_lamports > 0, ErrorCode::InvalidPrice);

        experience.organiser = ctx.accounts.organiser.key();
        experience.title = title;
        experience.description = description;
        experience.location = Some(location);
        experience.price_lamports = price_lamports;

        emit!(ExperienceCreated {
            organiser: ctx.accounts.organiser.key(),
            experience: experience.key(),
            title: experience.title.clone(),
        });

        Ok(())
    }

    // function to add a time slot to an experience
    pub fn add_time_slot(
        ctx: Context<AddTimeSlot>,
        start_time: i64,
        end_time: i64,
        price: u64
    ) -> Result<()> {
        let slot = &mut ctx.accounts.slot;
        let experience = &mut ctx.accounts.experience;

        require!(start_time < end_time, ErrorCode::InvalidTimeSlot);
        require!(price > 0, ErrorCode::InvalidPrice);
        require!(
            experience.time_slot_count < Experience::MAX_TIME_SLOTS,
            ErrorCode::TooManyTimeSlots
        );

        // adding the current time validation
        let current_time = Clock::get()?.unix_timestamp;
        require!(start_time > current_time, ErrorCode::InvalidTimeSlot);

        // Initialize the new slot
        slot.experience = experience.key();
        slot.start_time = start_time;
        slot.end_time = end_time;
        slot.is_booked = false;
        slot.price = price;

        // Increment the time slot count
        experience.time_slot_count = experience.time_slot_count
            .checked_add(1)
            .ok_or(ErrorCode::TooManyTimeSlots)?;

        Ok(())
    }

    pub fn cancel_reservation(ctx: Context<CancelReservation>) -> Result<()> {
        let reservation = &mut ctx.accounts.reservation;
        let slot = &mut ctx.accounts.slot;
        let experience = &ctx.accounts.experience;

        // check if the reservation is too late to cancel
        let current_time = Clock::get()?.unix_timestamp;
        let minimum_notice_period = 24 * 60 * 60; // 24 hours in seconds
        require!(
            slot.start_time - current_time >= minimum_notice_period,
            ErrorCode::TooLateToCancel
        );

        require!(reservation.is_active, ErrorCode::InvalidReservation);
        require_keys_eq!(reservation.user, ctx.accounts.user.key(), ErrorCode::Unauthorized);

        // calculate cancellation fee (percentage of the price)
        let cancellation_fee = (slot.price as u128)
            .checked_mul(experience.cancelation_fee_percent as u128)
            .unwrap()
            .checked_div(100)
            .unwrap() as u64;
        let refund_amount = slot.price - cancellation_fee;

        // refund to user after deducting cancellation fee
        invoke(
            &system_instruction::transfer(
                &experience.organiser.key(),
                &ctx.accounts.user.key(),
                refund_amount
            ),
            &[
                experience.to_account_info(),
                ctx.accounts.user.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ]
        )?;

        // transfer the cancellation fee to the organizer
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.user.key(),
                &experience.organiser.key(),
                cancellation_fee
            ),
            &[
                ctx.accounts.user.to_account_info(),
                experience.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ]
        )?;

        slot.is_booked = false;
        reservation.is_active = false;

        emit!(ReservationCancelled {
            user: ctx.accounts.user.key(),
            reservation: reservation.key(),
            cancellation_fee,
        });
        Ok(())
    }

    pub fn update_reservation(ctx: Context<UpdateReservation>, new_start_time: i64) -> Result<()> {
        let reservation = &mut ctx.accounts.reservation;
        let old_slot = &mut ctx.accounts.old_slot;
        let new_slot = &mut ctx.accounts.new_slot;

        require!(reservation.is_active, ErrorCode::AlreadyCancelled);
        require_keys_eq!(reservation.user, ctx.accounts.user.key(), ErrorCode::Unauthorized);
        require!(!new_slot.is_booked, ErrorCode::AlreadyBooked);

        // Free old slot
        old_slot.is_booked = false;

        // Book new slot
        new_slot.is_booked = true;

        // Update reservation data
        reservation.time_slot = new_start_time;
        reservation.start_time = new_slot.start_time;
        reservation.end_time = new_slot.end_time;

        emit!(ReservationUpdated {
            user: ctx.accounts.user.key(),
            reservation: reservation.key(),
            new_start_time,
        });

        Ok(())
    }
}

// context for booking a slot and minting an NFT
#[derive(Accounts)]
#[instruction(start_time: i64)]
pub struct BookSlot<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub experience: Account<'info, Experience>,

    #[account(
        mut,
        seeds = [b"slot", experience.key().as_ref(), start_time.to_le_bytes().as_ref()],
        bump,
        constraint = !slot.is_booked @ ErrorCode::AlreadyBooked
    )]
    pub slot: Account<'info, TimeSlotAccount>,

    #[account(
        init,
        payer = user,
        space = 8 + Reservation::LEN,
        seeds = [b"reservation", experience.key().as_ref(), start_time.to_le_bytes().as_ref()],
        bump
    )]
    pub reservation: Account<'info, Reservation>,

    /// CHECK: This is the mint account that will be initialized
    #[account(mut)]
    pub mint: UncheckedAccount<'info>,

    /// CHECK: This is the user's NFT account that will be created
    #[account(mut)]
    pub user_nft_account: UncheckedAccount<'info>,

    /// CHECK: This is the organiser's account
    #[account(mut)]
    pub organiser: AccountInfo<'info>,

    /// CHECK: Metaplex validates this PDA internally
    #[account(mut)]
    pub master_edition: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

    /// CHECK: Safe, Metaplex metadata account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// CHECK: Safe, Metaplex program
    pub metadata_program: UncheckedAccount<'info>,

    /// CHECK: Required for Metaplex CPI
    pub sysvar_instructions: UncheckedAccount<'info>,
}

// context for creating an experience
#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateExperience<'info> {
    #[account(mut)]
    pub organiser: Signer<'info>,

    #[account(
        init,
        payer = organiser,
        space = 8 + Experience::LEN,
        seeds = [b"experience", organiser.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub experience: Account<'info, Experience>,

    pub system_program: Program<'info, System>,
}

// context for the adding the time slot
#[derive(Accounts)]
#[instruction(start_time: i64)]
pub struct AddTimeSlot<'info> {
    #[account(mut)]
    pub organiser: Signer<'info>,

    #[account(mut, has_one = organiser)]
    pub experience: Account<'info, Experience>,

    #[account(
        init,
        payer = organiser,
        space = 8 + TimeSlotAccount::LEN,
        seeds = [b"slot", experience.key().as_ref(), start_time.to_le_bytes().as_ref()],
        bump
    )]
    pub slot: Account<'info, TimeSlotAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(start_time: i64)]
pub struct CancelReservation<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub experience: Account<'info, Experience>,

    #[account(
        mut,
        seeds = [b"reservation", experience.key().as_ref(), start_time.to_le_bytes().as_ref()],
        bump,
        has_one = user,
        constraint = reservation.is_active == true,
    )]
    pub reservation: Account<'info, Reservation>,

    #[account(
        mut,
        seeds = [b"slot", experience.key().as_ref(), start_time.to_le_bytes().as_ref()],
        bump
    )]
    pub slot: Account<'info, TimeSlotAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(current_start_time: i64, new_start_time: i64)]
pub struct UpdateReservation<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub experience: Account<'info, Experience>,

    #[account(
        mut,
        seeds = [b"reservation", experience.key().as_ref(), current_start_time.to_le_bytes().as_ref()],
        bump,
        has_one = user,
        constraint = reservation.is_active == true,
    )]
    pub reservation: Account<'info, Reservation>,

    #[account(
        mut,
        seeds = [b"slot", experience.key().as_ref(), current_start_time.to_le_bytes().as_ref()],
        bump
    )]
    pub old_slot: Account<'info, TimeSlotAccount>,

    #[account(
        mut,
        seeds = [b"slot", experience.key().as_ref(), new_start_time.to_le_bytes().as_ref()],
        bump
    )]
    pub new_slot: Account<'info, TimeSlotAccount>,
}

#[account]
pub struct TimeSlotAccount {
    pub experience: Pubkey,
    pub start_time: i64,
    pub end_time: i64,
    pub is_booked: bool,
    pub price: u64,
}

impl TimeSlotAccount {
    pub const LEN: usize =
        8 + // discriminator
        32 + // experience (Pubkey)
        8 + // start_time (i64)
        8 + // end_time (i64)
        1 + // is_booked (bool)
        8; // price (u64)
}

#[account]
pub struct Experience {
    pub organiser: Pubkey,
    pub title: String,
    pub description: String,
    pub location: Option<String>,
    pub price_lamports: u64,
    pub cancelation_fee_percent: u64,
    pub time_slot_count: u8, // Track number of time slots
}

impl Experience {
    pub const MAX_TITLE_LEN: usize = 24;
    pub const MAX_LOCATION_LEN: usize = 48;
    pub const MAX_DESCRIPTION_LEN: usize = 128;
    pub const MAX_CANCELATION_FEE: u8 = 100;
    pub const MAX_TIME_SLOTS: u8 = 10; // Maximum number of time slots allowed
    pub const LEN: usize =
        8 + // discriminator
        32 + // organiser
        4 +
        Self::MAX_TITLE_LEN + // title
        4 +
        Self::MAX_DESCRIPTION_LEN + // description
        1 +
        4 +
        Self::MAX_LOCATION_LEN + // Option<String>
        8 + // price_lamports
        8 + // cancellation_fee_percent
        1; // time_slot_count
}

#[account]
pub struct Reservation {
    pub experience_id: Pubkey, // linked experience account
    pub user: Pubkey, // user who made the reservation
    pub time_slot: i64, // index of the time slot in the experience account
    pub nft_mint: Pubkey,
    pub start_time: i64,
    pub end_time: i64,
    pub is_active: bool,
}

impl Reservation {
    const LEN: usize = 32 + 32 + 8 + 32 + 8 + 8 + 1;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid time slot provided.")]
    InvalidTimeSlot,
    #[msg("The time slot is already booked.")]
    AlreadyBooked,
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Name is too long")]
    TitleTooLong,
    #[msg("Location is too long")]
    LocationTooLong,
    #[msg("Invalid reservation")]
    InvalidReservation,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Reservation already cancelled")]
    AlreadyCancelled,
    #[msg("Invalid price - must be greater than 0")]
    InvalidPrice,
    #[msg("Title cannot be empty")]
    TitleEmpty,
    #[msg("Location cannot be empty")]
    LocationEmpty,
    #[msg("Maximum number of time slots reached")]
    TooManyTimeSlots,
    #[msg("Too late to cancel reservation")]
    TooLateToCancel,
}

// event for experience creation
#[event]
pub struct ExperienceCreated {
    pub organiser: Pubkey,
    pub experience: Pubkey,
    pub title: String,
}

// event for reservation creation
#[event]
pub struct ReservationCreated {
    pub user: Pubkey,
    pub reservation: Pubkey,
    pub nft_mint: Pubkey,
    pub start_time: i64,
}

// event for reservation cancellation
#[event]
pub struct ReservationCancelled {
    pub user: Pubkey,
    pub reservation: Pubkey,
    pub cancellation_fee: u64,
}

// event for reservation update
#[event]
pub struct ReservationUpdated {
    pub user: Pubkey,
    pub reservation: Pubkey,
    pub new_start_time: i64,
}
