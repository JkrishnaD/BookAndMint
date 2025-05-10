import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { web3, BN } from "@coral-xyz/anchor";
import { getPrograms } from "../hooks/get-programs";
import { toast } from "sonner";
import { TimeSlot } from "../hooks/user-experiences";
import { SYSVAR_INSTRUCTIONS_PUBKEY } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

interface BookSlotProps {
  slot: TimeSlot;
  experiencePubkey: string;
  organiserPubkey: string;
  onSuccess?: () => void;
}

const BookSlot = ({
  slot,
  experiencePubkey,
  organiserPubkey,
  onSuccess,
}: BookSlotProps) => {
  const { publicKey, wallet, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const encoder = new TextEncoder();

  const handleBookSlot = async () => {
    if (!wallet || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (publicKey.toBase58() === organiserPubkey) {
      toast.error("You cannot book your own experience slot");
      return;
    }

    if (slot.isBooked) {
      toast.error("This slot is already booked");
      return;
    }

    setIsLoading(true);
    try {
      const program = getPrograms(wallet);
      const experienceKey = new web3.PublicKey(experiencePubkey);
      const organiserKey = new web3.PublicKey(organiserPubkey);
      const mintKeypair = web3.Keypair.generate();

      const METADATA_PROGRAM_ID = new web3.PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      );

      const [metadataPda] = web3.PublicKey.findProgramAddressSync(
        [
          encoder.encode("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        METADATA_PROGRAM_ID
      );

      const SYSTEM_PROGRAM_ID = web3.SystemProgram.programId;
      const RENT_SYSVAR_ID = web3.SYSVAR_RENT_PUBKEY;

      const [slotPda] = web3.PublicKey.findProgramAddressSync(
        [
          new Uint8Array([...new TextEncoder().encode("slot")]),
          experienceKey.toBuffer(),
          new Uint8Array(
            new BN(slot.startTime).toArrayLike(Uint8Array, "le", 8)
          ),
        ],
        program.programId
      );

      const [reservationPda] = web3.PublicKey.findProgramAddressSync(
        [
          new Uint8Array([...new TextEncoder().encode("reservation")]),
          experienceKey.toBuffer(),
          new Uint8Array(
            new BN(slot.startTime).toArrayLike(Uint8Array, "le", 8)
          ),
        ],
        program.programId
      );

      const [masterEditionPda] = web3.PublicKey.findProgramAddressSync(
        [
          encoder.encode("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
          encoder.encode("edition"),
        ],
        METADATA_PROGRAM_ID
      );

      const userNftAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );

      if (!signTransaction) {
        toast.error("Wallet does not support signing transactions");
        return;
      }

      if (!program.provider) {
        toast.error("Program provider is not initialized");
        return;
      }

      const tx = await program.methods
        .bookSlot(new BN(slot.startTime))
        .accountsStrict({
          user: publicKey,
          experience: experienceKey,
          slot: slotPda,
          reservation: reservationPda,
          mint: mintKeypair.publicKey,
          userNftAccount,
          organiser: organiserKey,
          metadata: metadataPda,
          metadataProgram: METADATA_PROGRAM_ID,
          sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SYSTEM_PROGRAM_ID,
          masterEdition: masterEditionPda,
          rent: RENT_SYSVAR_ID,
        })
        .transaction();

      const { blockhash } =
        await program.provider.connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      tx.sign(mintKeypair);

      if (!program.provider?.sendAndConfirm) {
        throw new Error("Program provider is not properly initialized");
      }
      const signature = await program.provider.sendAndConfirm(tx, [
        mintKeypair,
      ]);
      console.log("Transaction signature:", signature);

      toast.success("Slot booked and NFT minted successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error booking slot:", err.message);
      if (err.logs) {
        console.error("Transaction logs:", err.logs);
      }
      toast.error(err.message || "Booking failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBookSlot}
      disabled={
        isLoading || slot.isBooked || publicKey?.toBase58() === organiserPubkey
      }
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isLoading
          ? "bg-gray-300 cursor-not-allowed"
          : slot.isBooked
          ? "bg-gray-300 cursor-not-allowed"
          : publicKey?.toBase58() === organiserPubkey
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Booking...
        </div>
      ) : slot.isBooked ? (
        "Booked"
      ) : publicKey?.toBase58() === organiserPubkey ? (
        "Cannot Book Own Slot"
      ) : (
        "Book Slot"
      )}
    </button>
  );
};

export default BookSlot;
