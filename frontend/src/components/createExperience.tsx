"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { getPrograms } from "../hooks/get-programs"
import { toast } from "sonner"
import { motion } from "motion/react"
import { MapPin, Type, FileText, Coins, Sparkles, Loader2, AlertCircle, Check, ChevronRight, ChevronLeft } from "lucide-react"
import confetti from "canvas-confetti"
import { PublicKey, SystemProgram } from "@solana/web3.js"
import BN from "bn.js"
import { useNavigate, Link } from "react-router-dom"

// Constants
const LAMPORTS_PER_SOL = 1_000_000_000
const MAX_TITLE_LEN = 24
const MAX_LOCATION_LEN = 48
const MAX_DESCRIPTION_LEN = 200

export default function CreateExperienceForm() {
  const { publicKey, wallet, connected } = useWallet()
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [priceInSol, setPriceInSol] = useState("")
  const [loading, setLoading] = useState(false)
  const [formStep, setFormStep] = useState(0)
  const [previewMode, setPreviewMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty")
      return false
    }
    if (title.length > MAX_TITLE_LEN) {
      toast.error(`Title must be ${MAX_TITLE_LEN} characters or less`)
      return false
    }
    if (!location.trim()) {
      toast.error("Location cannot be empty")
      return false
    }
    if (location.length > MAX_LOCATION_LEN) {
      toast.error(`Location must be ${MAX_LOCATION_LEN} characters or less`)
      return false
    }
    if (!description.trim()) {
      toast.error("Description cannot be empty")
      return false
    }
    const price = Number.parseFloat(priceInSol)
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be greater than 0")
      return false
    }
    return true
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wallet || !publicKey) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const program = getPrograms(wallet)
      const encoder = new TextEncoder()
      
      // Create PDA for the experience
      const [experiencePDA] = PublicKey.findProgramAddressSync(
        [
          encoder.encode("experience"),
          publicKey.toBuffer(),
          encoder.encode(title),
        ],
        program.programId
      )

      // Convert SOL to lamports
      const priceLamports = new BN(parseFloat(priceInSol) * LAMPORTS_PER_SOL)

      // Create the experience on chain
      const tx = await program.methods
        .createExperience(title, location, description, priceLamports)
        .accountsStrict({
          organiser: publicKey,
          experience: experiencePDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      console.log("Transaction signature:", tx)

      // Trigger confetti on success
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      toast.success("Experience created successfully!")

      // Reset form
      setTitle("")
      setDescription("")
      setLocation("")
      setPriceInSol("")
      setFormStep(0)
      setPreviewMode(false)

      // Redirect to the experience page
      navigate(`/experience/${experiencePDA.toString()}`)
    } catch (error: any) {
      console.error("Error creating experience:", error)
      if (error.logs) {
        console.error("Transaction logs:", error.logs)
      }
      toast.error(error.message || "Failed to create experience")
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (formStep === 0 && !title.trim()) {
      toast.error("Please enter a title")
      return
    }
    if (formStep === 1 && !description.trim()) {
      toast.error("Please enter a description")
      return
    }
    if (formStep === 2 && !location.trim()) {
      toast.error("Please enter a location")
      return
    }

    if (formStep < 3) {
      setFormStep(formStep + 1)
    }
  }

  const prevStep = () => {
    if (formStep > 0) {
      setFormStep(formStep - 1)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-10"
      >
        <Link
          to="/experiences"
          className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Experiences
        </Link>
      </motion.div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-70"
            initial={{
              x: Math.random() * 100 + "%",
              y: -10,
              opacity: 0.1 + Math.random() * 0.5,
              scale: 0.5 + Math.random() * 1.5,
            }}
            animate={{
              y: "120vh",
              opacity: 0,
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-1/4 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Create a Magical</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Experience on Chain
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg">
            Share your unique experience with the world and let others book it through the Solana blockchain.
          </p>
        </motion.div>

        {!connected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center max-w-md mx-auto"
          >
            <AlertCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Wallet Not Connected</h2>
            <p className="text-gray-300 mb-6">Please connect your wallet to create an experience.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-xl"
          >
            {/* Progress indicator */}
            <div className="bg-gray-800/50 p-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                {["Title", "Description", "Location", "Price"].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        idx === formStep
                          ? "bg-purple-600 text-white"
                          : idx < formStep
                            ? "bg-green-500 text-white"
                            : "bg-gray-700 text-gray-300"
                      } transition-all duration-300`}
                    >
                      {idx < formStep ? <Check className="h-4 w-4" /> : idx + 1}
                    </div>
                    <span
                      className={`mt-1 text-xs ${
                        idx === formStep ? "text-purple-400" : idx < formStep ? "text-green-400" : "text-gray-500"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(formStep / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleCreate} className="space-y-6">
                {/* Title Step */}
                {formStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <Type className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold text-white">What's your experience called?</h2>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="block text-sm font-medium text-gray-300">Title</label>
                        <span className={`text-xs ${title.length > MAX_TITLE_LEN ? "text-red-400" : "text-gray-400"}`}>
                          {title.length}/{MAX_TITLE_LEN}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter a catchy title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full p-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          maxLength={MAX_TITLE_LEN}
                          required
                        />
                        <Type className="h-5 w-5 text-gray-500 absolute left-3 top-3.5" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        A short, memorable title will help your experience stand out.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Description Step */}
                {formStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <FileText className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold text-white">Describe your experience</h2>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="block text-sm font-medium text-gray-300">Description</label>
                        <span
                          className={`text-xs ${description.length > MAX_DESCRIPTION_LEN ? "text-red-400" : "text-gray-400"}`}
                        >
                          {description.length}/{MAX_DESCRIPTION_LEN}
                        </span>
                      </div>
                      <div className="relative">
                        <textarea
                          placeholder="What makes your experience special?"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full p-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 min-h-[120px]"
                          maxLength={MAX_DESCRIPTION_LEN}
                          required
                        />
                        <FileText className="h-5 w-5 text-gray-500 absolute left-3 top-3.5" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Be descriptive and highlight what makes your experience unique.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Location Step */}
                {formStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <MapPin className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold text-white">Where will it take place?</h2>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="block text-sm font-medium text-gray-300">Location</label>
                        <span
                          className={`text-xs ${location.length > MAX_LOCATION_LEN ? "text-red-400" : "text-gray-400"}`}
                        >
                          {location.length}/{MAX_LOCATION_LEN}
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter the location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full p-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          maxLength={MAX_LOCATION_LEN}
                          required
                        />
                        <MapPin className="h-5 w-5 text-gray-500 absolute left-3 top-3.5" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Provide a specific address or a general area where your experience will take place.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Price Step */}
                {formStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <Coins className="h-5 w-5 text-purple-400" />
                      <h2 className="text-xl font-semibold text-white">Set your price</h2>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Price (SOL)</label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={priceInSol}
                          onChange={(e) => setPriceInSol(e.target.value)}
                          step="0.01"
                          min="0.01"
                          className="w-full p-3 pl-10 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                        <Coins className="h-5 w-5 text-gray-500 absolute left-3 top-3.5" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Set a fair price for your experience in SOL.</p>
                    </div>

                    {/* Preview card */}
                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center mb-4"
                      >
                        <Sparkles className="h-4 w-4 mr-1" />
                        {previewMode ? "Hide Preview" : "Preview Experience"}
                      </button>

                      {previewMode && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-800/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
                        >
                          <div className="h-40 bg-gradient-to-r from-purple-900/40 to-blue-900/40 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-purple-600/30 backdrop-blur-sm flex items-center justify-center">
                              <span className="text-2xl font-bold text-white">{title.charAt(0) || "?"}</span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{title || "Your Experience Title"}</h3>
                            <div className="flex items-center text-gray-300 mb-2">
                              <MapPin className="h-4 w-4 mr-1 text-purple-400" />
                              <span className="text-sm">{location || "Experience Location"}</span>
                            </div>
                            <p className="text-gray-400 mb-4">
                              {description || "Your experience description will appear here."}
                            </p>
                            <div className="flex items-center text-purple-400">
                              <Coins className="h-4 w-4 mr-1" />
                              <span className="font-semibold">{priceInSol || "0.00"} SOL</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      formStep === 0 ? "opacity-0 cursor-default" : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                    disabled={formStep === 0}
                  >
                    Back
                  </button>

                  {formStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center"
                    >
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center">
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                            Create Experience
                          </>
                        )}
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                        initial={{ x: "-100%" }}
                        animate={{ x: loading ? "0%" : "-100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
