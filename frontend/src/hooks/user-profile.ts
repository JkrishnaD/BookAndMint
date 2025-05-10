import { AnchorWallet } from "@solana/wallet-adapter-react";
import { getPrograms } from "./get-programs";
import { PublicKey } from "@solana/web3.js";
import { Experience, TimeSlot } from "./user-experiences";

export interface UserReservation {
  experience: Experience;
  slot: TimeSlot;
  nftMint: PublicKey;
  startTime: number;
  endTime: number;
  isActive: boolean;
}

export const fetchUserBookedExperiences = async (wallet: AnchorWallet, userAddress: string) => {
  try {
    const program = getPrograms(wallet);
    const userPubkey = new PublicKey(userAddress);

    // Fetch all time slots
    const allTimeSlots = await program.account.timeSlotAccount.all();
    
    // Filter slots booked by the user
    const userBookedSlots = allTimeSlots.filter(slot => 
      slot.account.booker && 
      slot.account.booker.equals(userPubkey)
    );

    // Fetch experiences for booked slots
    const bookedExperiences = await Promise.all(
      userBookedSlots.map(async (slot) => {
        const experience = await program.account.experience.fetch(slot.account.experience);
        return {
          experience: {
            organiser: experience.organiser,
            title: experience.title,
            description: experience.description,
            location: experience.location,
            priceLamports: experience.priceLamports.toNumber(),
            cancelationFeePercent: experience.cancelationFeePercent.toNumber(),
            timeSlots: [],
          },
          slot: {
            experience: slot.account.experience,
            startTime: slot.account.startTime.toNumber(),
            endTime: slot.account.endTime.toNumber(),
            isBooked: slot.account.isBooked,
            price: slot.account.price.toNumber(),
            booker: slot.account.booker,
          }
        };
      })
    );

    return bookedExperiences;
  } catch (error) {
    console.error("Error fetching user's booked experiences:", error);
    throw error;
  }
};

export const fetchUserProfile = async (wallet: AnchorWallet, userAddress: string) => {
  try {
    const program = getPrograms(wallet);
    const userPubkey = new PublicKey(userAddress);

    // Fetch user's created experiences
    const experienceAccounts = await program.account.experience.all([
      {
        memcmp: {
          offset: 8 + 32, // Skip discriminator and organiser
          bytes: userPubkey.toBase58(),
        },
      },
    ]);

    // Get booked experiences
    const bookedExperiences = await fetchUserBookedExperiences(wallet, userAddress);

    // Map created experiences
    const createdExperiences = experienceAccounts.map((exp) => ({
      organiser: exp.account.organiser,
      title: exp.account.title,
      description: exp.account.description,
      location: exp.account.location,
      priceLamports: exp.account.priceLamports.toNumber(),
      cancelationFeePercent: exp.account.cancelationFeePercent.toNumber(),
      timeSlots: [],
    }));

    return {
      bookedExperiences,
      createdExperiences,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}; 