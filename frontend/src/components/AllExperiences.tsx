"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getPrograms } from "../hooks/get-programs";
import { Loader2, MapPin, Tag, Info, AlertCircle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function AllExperiences() {
  const { publicKey, wallet } = useWallet();
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExperiences = async () => {
      if (!wallet || !publicKey) return;

      setLoading(true);
      try {
        const program = getPrograms(wallet);
        const allAccounts = await program.account.experience.all();
        console.log("All experiences:", allAccounts);
        setExperiences(allAccounts);
      } catch (error) {
        console.error("Error fetching experiences:", error);
        toast.error("Failed to fetch experiences");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [wallet, publicKey]);

  const formatPrice = (lamports: number) => {
    return (lamports / 1e9).toFixed(2) + " SOL";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Discover Amazing</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Experiences on Chain
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Browse through unique experiences created by our community members
            on the Solana blockchain.
          </p>
        </motion.div>

        {!wallet || !publicKey ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center max-w-md mx-auto"
          >
            <AlertCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Wallet Not Connected
            </h2>
            <p className="text-gray-300 mb-6">
              Please connect your wallet to view available experiences.
            </p>
          </motion.div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
            <p className="text-lg text-gray-300">Loading experiences...</p>
          </div>
        ) : experiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center max-w-md mx-auto"
          >
            <Info className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              No Experiences Found
            </h2>
            <p className="text-gray-300 mb-6">
              Be the first to create an experience!
            </p>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition duration-300"
            >
              Create Experience
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.publicKey.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to={`/experience/${exp.publicKey.toString()}`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white truncate">
                        {exp.account.title}
                      </h3>
                      <span className="px-3 py-1 text-sm font-medium text-purple-200 bg-purple-900/50 rounded-full">
                        {formatPrice(exp.account.priceLamports.toNumber())}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {exp.account.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      {exp.account.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{exp.account.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>View Slots</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
