"use client";
import React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";
import { type Experience, type TimeSlot } from "../hooks/user-experiences";
import { useParams } from "react-router-dom";
import { getPrograms } from "../hooks/get-programs";
import { PublicKey } from "@solana/web3.js";
import BookSlot from "./BookSlot";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles, User, Wallet } from "lucide-react";

interface ExperienceDetailsProps {
  experience: Experience;
  isOrganizer: boolean;
  onAddSlot: () => void;
}

const ExperienceDetails = ({
  experience,
  isOrganizer,
  onAddSlot,
}: ExperienceDetailsProps) => {
  const { pubkey } = useParams();
  const wallet = useWallet();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadExperience = async () => {
    if (!wallet.connected || !pubkey) return;

    try {
      setLoading(true);

      const program = getPrograms(wallet);
      const experiencePubkey = new PublicKey(pubkey);
      const slotAccounts = await program.account.timeSlotAccount.all();

      // Filter slots that belong to this experience
      const filteredSlots = slotAccounts
        .filter((slot) => slot.account.experience.equals(experiencePubkey))
        .map((slot) => ({
          experience: slot.account.experience,
          startTime: slot.account.startTime.toNumber(),
          endTime: slot.account.endTime.toNumber(),
          isBooked: slot.account.isBooked,
          price: slot.account.price.toNumber(),
        }));

      setSlots(filteredSlots);
    } catch (err) {
      console.error("Error loading experience:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperience();
  }, [wallet, pubkey]);

  const formatDate = (timestamp: number) => {
    try {
      return new Date(timestamp * 1000).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      toast.error("Error formatting date");
      return "Invalid date";
    }
  };

  const formatPrice = (lamports: number) => {
    try {
      return (lamports / 1e9).toFixed(2) + " SOL";
    } catch (error) {
      toast.error("Error formatting price");
      return "Invalid price";
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-900 overflow-hidden relative">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-70"
            style={{
              width: Math.random() * 6 + 2 + "px",
              height: Math.random() * 6 + 2 + "px",
              background: `rgba(${150 + Math.random() * 100}, ${
                100 + Math.random() * 100
              }, ${200 + Math.random() * 55}, ${0.3 + Math.random() * 0.7})`,
            }}
            initial={{
              x: Math.random() * 100 + "%",
              y: -10,
              opacity: 0.1 + Math.random() * 0.5,
              scale: 0.5 + Math.random() * 1.5,
            }}
            animate={{ y: "120vh", opacity: 0 }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {isOrganizer && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end mb-6"
          >
            <button
              onClick={onAddSlot}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 font-medium flex items-center gap-2 transform hover:-translate-y-1 shadow-lg"
            >
              <Calendar className="h-5 w-5" />
              Add Time Slot
            </button>
          </motion.div>
        )}

        <motion.div
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-400/30 overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Experience Header */}
          <div className="relative bg-gradient-to-r from-purple-800/80 to-indigo-800/80 p-8 md:p-12 border-b border-purple-400/20">
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            />

            <motion.div
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center bg-purple-500/30 rounded-full p-1.5">
                  <Sparkles className="h-4 w-4 text-purple-200" />
                </span>
                <span className="text-purple-200 text-sm font-medium uppercase tracking-wider">
                  Experience
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {experience.title}
              </h1>

              <p className="text-lg text-gray-200 mb-6 max-w-2xl">
                {experience.description}
              </p>

              <p className="text-sm text-gray-200 mb-6 max-w-2xl flex items-center">
                <MapPin className="h-4 w-4 mr-2" /> {experience.location}
              </p>
              <div className="flex items-center text-purple-200 text-sm">
                <User className="h-4 w-4 mr-2" />
                <span>Organized by: </span>
                <span className="font-mono ml-1 opacity-80 hover:opacity-100 transition-opacity">
                  {experience.organiser.toBase58().slice(0, 6)}...
                  {experience.organiser.toBase58().slice(-4)}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Loading Skeleton */}
            {loading && (
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-purple-300/20 rounded-lg w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-purple-300/20 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-purple-300/20 rounded-lg w-5/6 mb-6"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-purple-300/10 rounded-xl w-full"
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                className="bg-red-500/20 border border-red-500/30 text-red-200 p-6 rounded-xl text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-semibold text-lg mb-2">
                  Something went wrong
                </p>
                <p>{error}</p>
              </motion.div>
            )}

            {/* Slots Section */}
            {!loading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-300" />
                    Available Time Slots
                  </h2>
                  <div className="text-sm text-purple-200 bg-purple-500/20 px-3 py-1 rounded-full">
                    {slots.length} {slots.length === 1 ? "slot" : "slots"}{" "}
                    available
                  </div>
                </div>

                {slots && slots.length > 0 ? (
                  <div className="grid gap-4">
                    {slots.map((slot, index) => (
                      <motion.div
                        key={index}
                        className={`rounded-xl border shadow-lg transition-all ${
                          slot.isBooked
                            ? "bg-gray-800/60 border-gray-600/40 hover:border-gray-500/60"
                            : "bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border-purple-500/30 hover:border-purple-400/60"
                        } overflow-hidden`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.1 + index * 0.05,
                        }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-purple-300" />
                              <p className="font-bold text-white">
                                {formatDate(slot.startTime)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Wallet className="h-4 w-4 text-purple-300" />
                              <p className="text-gray-300">
                                Price:{" "}
                                <span className="font-semibold text-white">
                                  {formatPrice(slot.price)}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                slot.isBooked
                                  ? "bg-gray-700 text-gray-300"
                                  : "bg-purple-500/30 text-purple-100"
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
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    className="bg-purple-900/30 border border-purple-500/20 rounded-xl p-8 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-purple-200 text-lg">
                      No time slots available for this experience yet.
                    </p>
                    <p className="text-purple-300/70 mt-2">
                      Check back later or explore other experiences.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExperienceDetails;
