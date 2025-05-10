use anchor_lang::{ prelude::{Context, Pubkey}, solana_program::instruction::Instruction, Key };
use mpl_token_metadata::{
    instructions::{ CreateV1Builder },
    types::{ Creator, PrintSupply, TokenStandard },
};

use crate::BookSlot;

pub fn build_metadata_ix(
    ctx: &Context<BookSlot>,
    metadata_uri: String,
    symbol: String
) -> Instruction {

    let (master_edition, _bump) = Pubkey::find_program_address(
        &[
            b"metadata",
            mpl_token_metadata::ID.as_ref(),
            ctx.accounts.mint.key().as_ref(),
            b"edition",
        ],
        &mpl_token_metadata::ID,
    );
    
    let creators = vec![Creator {
        address: ctx.accounts.user.key(),
        verified: true,
        share: 100,
    }];

    CreateV1Builder::new()
        .metadata(ctx.accounts.metadata.key().into())
        .mint(ctx.accounts.mint.key(), true)
        .payer(ctx.accounts.user.key())
        .update_authority(ctx.accounts.user.key(), true)
        .authority(ctx.accounts.user.key())
        .system_program(ctx.accounts.system_program.key())
        .spl_token_program(Some(ctx.accounts.token_program.key()))
        .sysvar_instructions(anchor_lang::solana_program::sysvar::instructions::ID)
        .name(ctx.accounts.experience.title.clone())
        .symbol(symbol)
        .uri(metadata_uri)
        .seller_fee_basis_points(0)
        .creators(creators)
        .is_mutable(true)
        .token_standard(TokenStandard::NonFungible)
        .print_supply(PrintSupply::Zero)
        .master_edition(Some(ctx.accounts.master_edition.key()))
        .instruction()
}
