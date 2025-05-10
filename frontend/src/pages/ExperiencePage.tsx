import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";

import ExperienceDetails from "../components/ExperienceDetails";
import { fetchExperienceByPubkey } from "../hooks/user-experiences";
import AddSlotModal from "../components/AddSlot";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

type Experience = {
  organiser: PublicKey;
  title: string;
  description: string;
  location: string | null;
  priceLamports: BN;
};

const ExperiencePage = () => {
  const { pubkey } = useParams();
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (pubkey && wallet) {
      fetchExperienceByPubkey(wallet, pubkey)
        .then(setExperience)
        .catch(console.error);
    }
  }, [pubkey, wallet]);

  if (!experience) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <ExperienceDetails experience={experience} />

      {publicKey?.toBase58() === experience.organiser.toBase58() && (
        <button
          onClick={() => setOpenModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Add Slot
        </button>
      )}

      {openModal && (
        <AddSlotModal
          experiencePubkey={pubkey}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default ExperiencePage;
