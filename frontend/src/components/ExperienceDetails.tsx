import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import {
  fetchExperienceByPubkey,
  Experience,
  TimeSlot,
} from "../hooks/user-experiences";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { useParams } from "react-router-dom";
import { getPrograms } from "../hooks/get-programs";
import { PublicKey } from "@solana/web3.js";
import BookSlot from "./BookSlot";

const ExperienceDetails = () => {
  const { pubkey } = useParams();
  const wallet = useWallet();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const loadExperience = async () => {
    if (!wallet.connected || !pubkey) return;

    try {
      setLoading(true);
      const anchorWallet = {
        publicKey: wallet.publicKey!,
        signTransaction: wallet.signTransaction!,
        signAllTransactions: wallet.signAllTransactions!,
      } as AnchorWallet;
      
      const program = getPrograms(wallet);
      const experiencePubkey = new PublicKey(pubkey);
      const slotAccounts = await program.account.timeSlotAccount.all();
      
      // Filter slots that belong to this experience
      const filteredSlots = slotAccounts
        .filter(slot => slot.account.experience.equals(experiencePubkey))
        .map(slot => ({
          experience: slot.account.experience,
          startTime: slot.account.startTime.toNumber(),
          endTime: slot.account.endTime.toNumber(),
          isBooked: slot.account.isBooked,
          price: slot.account.price.toNumber(),
        }));
      
      setSlots(filteredSlots);
      const data = await fetchExperienceByPubkey(anchorWallet, pubkey);
      setExperience(data);
    } catch (err) {
      console.error("Error loading experience:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperience();
  }, [wallet, pubkey]);

  const formatDate = (timestamp) => {
    try {
      return new Date(timestamp * 1000).toLocaleString();
    } catch (error) {
      toast.error("Error formatting date");
      return "Invalid date";
    }
  };

  const formatPrice = (lamports) => {
    try {
      return (lamports / 1e9).toFixed(2) + " SOL";
    } catch (error) {
      toast.error("Error formatting price");
      return "Invalid price";
    }
  };

  if (loading) {
    return (
      <div className="border p-6 rounded-lg shadow-lg bg-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
    return null;
  }

  if (!experience) {
    toast.error("Experience data not available");
    return null;
  }

  return (
    <div className="border p-6 rounded-lg shadow-lg bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {experience.title}
        </h2>
        <p className="text-gray-600 mb-4">{experience.description}</p>
        <p className="text-sm text-gray-500">
          Created by: {experience.organiser.toBase58()}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Available Time Slots
        </h3>
        {slots && slots.length > 0 ? (
          <div className="grid gap-4">
            {slots.map((slot, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  slot.isBooked
                    ? "bg-gray-100 border-gray-300"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {formatDate(slot.startTime)} - {formatDate(slot.endTime)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Price: {formatPrice(slot.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        slot.isBooked
                          ? "bg-gray-200 text-gray-700"
                          : "bg-green-200 text-green-700"
                      }`}
                    >
                      {slot.isBooked ? "Booked" : "Available"}
                    </span>
                    <BookSlot
                      slot={slot}
                      experiencePubkey={pubkey!}
                      organiserPubkey={experience.organiser.toBase58()}
                      onSuccess={loadExperience}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No time slots available yet.</p>
        )}
      </div>
    </div>
  );
};

export default ExperienceDetails;
