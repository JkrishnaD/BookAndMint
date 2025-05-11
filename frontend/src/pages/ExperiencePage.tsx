import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { ExperienceLoader } from "../components/ExperienceLoader";
import ExperienceDetails from "../components/ExperienceDetails";
import { fetchExperienceByPubkey, Experience } from "../hooks/user-experiences";
import AddSlotModal from "../components/AddSlot";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const ExperiencePage = () => {
  const { pubkey } = useParams();
  const { publicKey } = useWallet();
  const wallet = useAnchorWallet();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const refreshExperience = async () => {
    if (pubkey && wallet) {
      try {
        const exp = await fetchExperienceByPubkey(wallet, pubkey);
        setExperience(exp);
      } catch (error) {
        console.error("Error refreshing experience:", error);
      }
    }
  };

  useEffect(() => {
    refreshExperience();
  }, [pubkey, wallet]);

  if (!experience) {
    return <ExperienceLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4"
        >
          <Link
            to="/experiences"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Experiences
          </Link>
        </motion.div>
        <ExperienceDetails
          experience={experience}
          isOrganizer={publicKey?.toBase58() === experience.organiser.toBase58()}
          onAddSlot={() => setOpenModal(true)}
        />

        {openModal && pubkey && (
          <AddSlotModal
            experiencePubkey={pubkey}
            onClose={() => setOpenModal(false)}
            onSuccess={refreshExperience}
          />
        )}
      </div>
    </div>
  );
};

export default ExperiencePage;
