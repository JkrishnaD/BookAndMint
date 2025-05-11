import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  User,
  Wallet,
  BookOpen,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { fetchUserProfile } from "../hooks/user-profile";
import { Experience } from "../hooks/user-experiences";
import { Link } from "react-router-dom";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

interface BookedExperience {
  experience: Experience;
  slot: {
    experience: PublicKey;
    startTime: number;
    endTime: number;
    isBooked: boolean;
    price: number;
    booker: PublicKey | null;
  };
}

const UserProfile = () => {
  const { publicKey, wallet } = useWallet();
  const [bookedExperiences, setBookedExperiences] = useState<BookedExperience[]>([]);
  const [createdExperiences, setCreatedExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!wallet || !publicKey) return;

      try {
        setLoading(true);
        const { bookedExperiences, createdExperiences } = await fetchUserProfile(
          wallet as unknown as AnchorWallet,
          publicKey.toBase58()
        );
        setBookedExperiences(bookedExperiences);
        setCreatedExperiences(createdExperiences);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [wallet, publicKey]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (lamports: number) => {
    return (lamports / 1e9).toFixed(2) + " SOL";
  };

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Please Connect Your Wallet
          </h2>
          <p className="text-purple-200">
            Connect your wallet to view your profile
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-900">
        <div className="container mx-auto px-4 py-12">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-purple-900">
      <div className="container mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/experiences"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Experiences
          </Link>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-purple-400/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-500/30 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-purple-200" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <p className="text-purple-200 font-mono">
                {publicKey.toBase58().slice(0, 6)}...
                {publicKey.toBase58().slice(-4)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Booked Experiences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-300" />
            My Bookings
          </h2>
          {bookedExperiences.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-purple-400/30 text-center"
            >
              <BookOpen className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Bookings Yet</h3>
              <p className="text-purple-200 mb-4">
                You haven't booked any experiences yet. Start exploring and book your first experience!
              </p>
              <Link
                to="/experiences"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/30 hover:bg-purple-500/40 text-white rounded-lg transition-colors"
              >
                Browse Experiences
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {bookedExperiences.map((booking, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-purple-400/30"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {booking.experience.title}
                      </h3>
                      <div className="space-y-2">
                        <p className="text-purple-200 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(booking.slot.startTime)}
                        </p>
                        <p className="text-purple-200 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatDate(booking.slot.endTime)}
                        </p>
                        <p className="text-purple-200 flex items-center gap-2">
                          <Wallet className="w-4 h-4" />
                          {formatPrice(booking.slot.price)}
                        </p>
                        {booking.experience.location && (
                          <p className="text-purple-200 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {booking.experience.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-500/20 text-green-200 rounded-full text-sm">
                        Active
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Created Experiences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-300" />
            My Experiences
          </h2>
          {createdExperiences.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl p-8 border border-purple-400/30 text-center"
            >
              <Sparkles className="w-12 h-12 text-purple-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Experiences Created</h3>
              <p className="text-purple-200 mb-4">
                You haven't created any experiences yet. Share your expertise with others!
              </p>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500/30 hover:bg-purple-500/40 text-white rounded-lg transition-colors"
              >
                Create Your First Experience
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {createdExperiences.map((experience, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-purple-400/30"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {experience.title}
                      </h3>
                      <p className="text-purple-200 mb-4">
                        {experience.description}
                      </p>
                      <div className="space-y-2">
                        <p className="text-purple-200 flex items-center gap-2">
                          <Wallet className="w-4 h-4" />
                          {formatPrice(experience.priceLamports)}
                        </p>
                        {experience.location && (
                          <p className="text-purple-200 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {experience.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/experience/${experience.organiser.toBase58()}`}
                      className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/40 text-white rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
