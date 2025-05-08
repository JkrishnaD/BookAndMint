use anchor_lang::prelude::*;
use serde_json::json;
use crate::Experience;

pub fn create_metadata(
    experience: &Experience,
    start_time: i64,
    end_time: i64
) -> String {
    let template_url = "https://raw.githubusercontent.com/JkrishnaD/slot-mint-asset/main/booking-template.png";
    
    let metadata = json!({
        "name": format!("Booking: {}", experience.title),
        "symbol": "BOOK",
        "description": format!(
            "NFT representing a booking for {} at {}",
            experience.title,
            experience.location.as_ref().unwrap_or(&"No location".to_string())
        ),
        "image": template_url,
        "attributes": [
            { "trait_type": "Experience", "value": experience.title },
            { "trait_type": "Start Time", "value": start_time.to_string() },
            { "trait_type": "End Time", "value": end_time.to_string() },
            { "trait_type": "Location", "value": experience.location.as_ref().unwrap_or(&"No location".to_string()) }
        ],
        "properties": {
            "files": [ { 
                "uri": template_url,
                "type": "image/png" 
            } ],
            "category": "image"
        }
    });

    metadata.to_string()
}

#[error_code]
pub enum MetadataError {
    #[msg("Failed to create metadata")]
    MetadataCreationFailed,
}
