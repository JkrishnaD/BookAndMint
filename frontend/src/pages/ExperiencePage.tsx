import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { ExperienceLoader } from "../components/ExperienceLoader";
import ExperienceDetails from "../components/ExperienceDetails";
import { fetchExperienceByPubkey, Experience } from "../hooks/user-experiences";
import AddSlotModal from "../components/AddSlot";

const ExperiencePage = () => {
  const { pubkey } = useParams();
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (pubkey && wallet) {
      fetchExperienceByPubkey(wallet, pubkey)
        .then((exp) => setExperience(exp))
        .catch(console.error);
    }
  }, [pubkey, wallet]);

  if (!experience) {
    return <ExperienceLoader />;
  }

  return (
    <div>
      <ExperienceDetails
        experience={experience}
        isOrganizer={publicKey?.toBase58() === experience.organiser.toBase58()}
        onAddSlot={() => setOpenModal(true)}
      />

      {openModal && pubkey && (
        <AddSlotModal
          experiencePubkey={pubkey}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default ExperiencePage;
