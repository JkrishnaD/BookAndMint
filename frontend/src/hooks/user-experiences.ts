import { AnchorWallet } from "@solana/wallet-adapter-react";
import { getPrograms } from "./get-programs";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export interface TimeSlot {
  experience: PublicKey;
  startTime: number;
  endTime: number;
  isBooked: boolean;
  price: number;
  booker: PublicKey | null;
}

export interface Experience {
  organiser: PublicKey;
  title: string;
  description: string;
  location: string | null;
  priceLamports: number;
  cancelationFeePercent: number;
  timeSlots: TimeSlot[];
}

export const fetchExperienceByPubkey = async (wallet: AnchorWallet, pubkey: string): Promise<Experience> => {
    try {
        const program = getPrograms(wallet);
        const experiencePubkey = new PublicKey(pubkey);
        const experienceAccount = await program.account.experience.fetch(experiencePubkey);

        // Fetch time slots for this experience using a filter
        const slotAccounts = await program.account.timeSlotAccount.all([
            {
                memcmp: {
                    offset: 8, // Skip discriminator
                    bytes: experiencePubkey.toBase58(),
                },
            },
        ]);

        // Map the filtered slots
        const timeSlots = slotAccounts.map(slot => ({
            experience: slot.account.experience,
            startTime: slot.account.startTime.toNumber(),
            endTime: slot.account.endTime.toNumber(),
            isBooked: slot.account.isBooked,
            price: slot.account.price.toNumber(),
            booker: slot.account.booker,
        }));

        return {
            organiser: experienceAccount.organiser,
            title: experienceAccount.title,
            description: experienceAccount.description,
            location: experienceAccount.location ?? null,
            priceLamports: experienceAccount.priceLamports.toNumber(),
            cancelationFeePercent: experienceAccount.cancelationFeePercent.toNumber(),
            timeSlots,
        };
    } catch (error) {
        console.error("Error fetching experience by pubkey:", error);
        throw error;
    }
};
