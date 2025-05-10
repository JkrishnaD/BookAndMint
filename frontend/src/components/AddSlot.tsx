import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { web3, BN } from "@coral-xyz/anchor";
import { getPrograms } from "../hooks/get-programs";
import { toast } from "sonner";

const AddSlotModal = ({ experiencePubkey, onClose }) => {
  const { publicKey, wallet } = useWallet();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleStartTimeChange = (e) => {
    const value = e.target.value;
    console.log("Start time input value:", value);
    setStartTime(value);
  };

  const handleEndTimeChange = (e) => {
    const value = e.target.value;
    console.log("End time input value:", value);
    setEndTime(value);
  };

  const validateInputs = () => {
    console.log("Validating inputs:", { startTime, endTime, price });
    
    if (!startTime || !endTime || !price) {
      setError("Please fill in all fields");
      return false;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    console.log("Parsed dates:", { start, end, now });

    if (start < now) {
      setError("Start time must be in the future");
      return false;
    }

    if (end <= start) {
      setError("End time must be after start time");
      return false;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Price must be greater than 0");
      return false;
    }

    setError("");
    return true;
  };

  const handleAddSlot = async () => {
    if (!wallet || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const startUnix = Math.floor(new Date(startTime).getTime() / 1000);
      const endUnix = Math.floor(new Date(endTime).getTime() / 1000);
      const priceLamports = new BN(price);
      
      console.log("Submitting with values:", {
        startTime,
        endTime,
        price,
        startUnix,
        endUnix,
        priceLamports: priceLamports.toString()
      });
      
      const program = getPrograms(wallet);

      await program.methods
        .addTimeSlot(new BN(startUnix), new BN(endUnix), priceLamports)
        .accounts({
          experience: new web3.PublicKey(experiencePubkey),
        })
        .rpc();

      toast.success("Time slot added successfully!");
      onClose(); // close modal after success
    } catch (err) {
      console.error("Error adding slot:", err);
      toast.error(err.message || "Failed to add slot. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Time Slot</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            X
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={startTime}
              onChange={handleStartTimeChange}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              value={endTime}
              onChange={handleEndTimeChange}
              min={startTime || new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (in Lamports)
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter price in lamports"
                value={price}
                onChange={(e) => {
                  console.log("Price changed:", e.target.value);
                  setPrice(e.target.value);
                }}
                min="0"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                1 SOL = 1,000,000,000 lamports
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleAddSlot}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                Adding...
              </>
            ) : (
              "Add Time Slot"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSlotModal;
