use anchor_lang::prelude::*;
use anchor_spl::{ associated_token::AssociatedToken, token::{ Mint, Token, TokenAccount } };

declare_id!("CEtHi5avWuMShWEzDzXvhdFfk26cAsn6XMCaoDo1q8Ex");

#[program]
pub mod contract {
    use anchor_lang::solana_program::program::invoke_signed;
    use anchor_spl::token::{ mint_to, MintTo };
    use mpl_token_metadata::instructions::CreateV1Builder;
    use mpl_token_metadata::types::{ Creator, TokenStandard };

    use super::*;

    pub fn book_slot(ctx: Context<BookSlot>, time_slot: i64) -> Result<()> {
        // 1. Validate slot index and availability
        // let experience = &mut ctx.accounts.experience;
        let experience_key = ctx.accounts.experience.key(); // ✅ Immutable borrow before

        let slot = ctx.accounts.experience.slots
            .get_mut(time_slot as usize)
            .ok_or_else(|| error!(ErrorCode::InvalidTimeSlot))?;
        require!(!slot.is_booked, ErrorCode::AlreadyBooked);

        slot.is_booked = true;

        require!(!slot.is_booked, ErrorCode::AlreadyBooked);
        slot.is_booked = true;

        // 2. Fill Reservation account
        let reservation = &mut ctx.accounts.reservation;
        reservation.experience_id = experience_key;
        reservation.user = ctx.accounts.user.key();
        reservation.time_slot = time_slot;
        reservation.nft_mint = ctx.accounts.mint.key();
        reservation.start_time = slot.start_time;
        reservation.end_time = slot.end_time;
        reservation.is_active = true;

        // 3. Mint NFT to user
        let cpi_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.user_nft_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        });
        mint_to(cpi_ctx, 1)?;

        // 4. Create Metaplex Metadata account for the NFT
        let creators = vec![Creator {
            address: ctx.accounts.user.key(),
            verified: true,
            share: 100,
        }];

        let clock = Clock::get()?;
        let timestamp = clock.unix_timestamp;

        let metadata_uri = format!(
            "https://your-storage.com/nfts/{}_{}.json",
            ctx.accounts.user.key(),
            timestamp
        );

        let ix = CreateV1Builder::new()
            .metadata(ctx.accounts.metadata.key().into())
            .mint(ctx.accounts.mint.key(), true)
            .payer(ctx.accounts.user.key())
            .update_authority(ctx.accounts.user.key(), true)
            .authority(ctx.accounts.user.key())
            .system_program(ctx.accounts.system_program.key())
            .spl_token_program(Some(ctx.accounts.token_program.key()))
            .sysvar_instructions(anchor_lang::solana_program::sysvar::instructions::ID)
            .name(ctx.accounts.experience.name.clone())
            .symbol(ctx.accounts.experience.location.clone())
            .uri(metadata_uri)
            .seller_fee_basis_points(0)
            .creators(creators)
            .is_mutable(true)
            .token_standard(TokenStandard::NonFungible)
            .instruction();

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
            ],
            &[]
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(time_slot: i64)]
pub struct BookSlot<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub experience: Account<'info, Experience>,

    #[account(
        init,
        payer = user,
        space = 8 + Reservation::LEN,
        seeds = [b"reservation", experience.key().as_ref(), time_slot.to_le_bytes().as_ref()],
        bump
    )]
    pub reservation: Account<'info, Reservation>,

    #[account(
        init,
        payer = user,
        mint::decimals = 0,
        mint::authority = user,
        mint::freeze_authority = user
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = mint,
        associated_token::authority = user
    )]
    pub user_nft_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    /// CHECK: We are manually verifying metadata account in the program
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    /// CHECK: Metaplex Metadata Program - safe to use unchecked
    pub metadata_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,

    /// CHECK: System Program - safe to use unchecked
    pub sysvar_instructions: UncheckedAccount<'info>,

    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct Experience {
    pub organiser: Pubkey,
    pub name: String,
    pub location: String,
    pub slots: Vec<TimeSlot>,
}

#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct TimeSlot {
    pub start_time: i64,
    pub end_time: i64,
    pub is_booked: bool,
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
    pub const LEN: usize = 32 + 32 + 8 + 32 + 8 + 8 + 1;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid time slot provided.")]
    InvalidTimeSlot,
    #[msg("The time slot is already booked.")]
    AlreadyBooked,
}
