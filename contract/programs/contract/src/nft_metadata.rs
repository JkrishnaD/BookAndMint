use anchor_lang::prelude::*;

use crate::Experience;

pub fn create_metadata_uri(
    experience: &Experience,
    start_time: i64,
    end_time: i64,
) -> String {
    // Use a single template file for all bookings
    String::from("https://raw.githubusercontent.com/JkrishnaD/slot-mint-asset/main/metadata/template.json")
}

#[error_code]
pub enum MetadataError {
    #[msg("Failed to create metadata")]
    MetadataCreationFailed,
}
