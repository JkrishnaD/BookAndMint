"use client"
import React from "react"
import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { web3, BN } from "@coral-xyz/anchor"
import { getPrograms } from "../hooks/get-programs"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Calendar, Clock, Coins, X, Loader2, Sparkles } from "lucide-react"

interface AddSlotModalProps {
  experiencePubkey: string
  onClose: () => void
}

const AddSlotModal = ({ experiencePubkey, onClose }: AddSlotModalProps) => {
  const { publicKey, wallet } = useWallet()
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [price, setPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setStartTime(value)
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEndTime(value)
  }

  const validateInputs = () => {
    if (!startTime || !endTime || !price) {
      setError("Please fill in all fields")
      return false
    }

    const start = new Date(startTime)
    const end = new Date(endTime)
    const now = new Date()

    if (start < now) {
      setError("Start time must be in the future")
      return false
    }

    if (end <= start) {
      setError("End time must be after start time")
      return false
    }

    const priceNum = Number(price)
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Price must be greater than 0")
      return false
    }

    setError("")
    return true
  }

  const handleAddSlot = async () => {
    if (!wallet || !publicKey) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!validateInputs()) {
      return
    }

    setIsLoading(true)
    try {
      const startUnix = Math.floor(new Date(startTime).getTime() / 1000)
      const endUnix = Math.floor(new Date(endTime).getTime() / 1000)
      const priceLamports = new BN(price)

      const program = getPrograms(wallet)

      await program.methods
        .addTimeSlot(new BN(startUnix), new BN(endUnix), priceLamports)
        .accounts({
          experience: new web3.PublicKey(experiencePubkey),
        })
        .rpc()

      toast.success("Time slot added successfully!")
      onClose()
    } catch (err: any) {
      console.error("Error adding slot:", err)
      toast.error(err.message || "Failed to add slot. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-gradient-to-br from-violet-950/90 to-indigo-950/90 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-purple-500/30 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center bg-purple-500/30 rounded-full p-1.5">
                <Sparkles className="h-4 w-4 text-purple-200" />
              </span>
              <h2 className="text-2xl font-bold text-white">Add Time Slot</h2>
            </div>
            <button
              onClick={onClose}
              className="text-purple-300 hover:text-white transition-colors p-2 hover:bg-purple-800/50 rounded-full"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-200 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-5">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2 flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Start Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  className="w-full p-3 pl-10 bg-purple-900/40 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-transparent transition-all duration-300"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <Calendar className="h-5 w-5 text-purple-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                End Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  className="w-full p-3 pl-10 bg-purple-900/40 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-transparent transition-all duration-300"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  min={startTime || new Date().toISOString().slice(0, 16)}
                />
                <Clock className="h-5 w-5 text-purple-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2 flex items-center gap-1.5">
                <Coins className="h-4 w-4" />
                Price (in Lamports)
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full p-3 pl-10 bg-purple-900/40 border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/70 focus:border-transparent transition-all duration-300"
                  placeholder="Enter price in lamports"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                />
                <Coins className="h-5 w-5 text-purple-400 absolute left-3 top-3.5" />
              </div>
              <p className="mt-2 text-purple-300/70 text-xs flex items-center">
                <span className="inline-block mr-1">💡</span>1 SOL = 1,000,000,000 lamports
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-purple-900/50 text-purple-200 rounded-xl hover:bg-purple-800/60 transition-all duration-300 font-medium border border-purple-700/30"
              disabled={isLoading}
            >
              Cancel
            </button>
            <motion.button
              onClick={handleAddSlot}
              disabled={isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-700/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Adding...
                </>
              ) : (
                "Add Time Slot"
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AddSlotModal
