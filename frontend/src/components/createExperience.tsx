import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getPrograms } from "../hooks/get-programs";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { toast } from "sonner";

const LAMPORTS_PER_SOL = 1_000_000_000;
const MAX_TITLE_LEN = 24;
const MAX_LOCATION_LEN = 48;

const CreateExperienceForm = () => {
  const { publicKey, wallet } = useWallet();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priceInSol, setPriceInSol] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return false;
    }
    if (title.length > MAX_TITLE_LEN) {
      toast.error(`Title must be ${MAX_TITLE_LEN} characters or less`);
      return false;
    }
    if (!location.trim()) {
      toast.error("Location cannot be empty");
      return false;
    }
    if (location.length > MAX_LOCATION_LEN) {
      toast.error(`Location must be ${MAX_LOCATION_LEN} characters or less`);
      return false;
    }
    if (!description.trim()) {
      toast.error("Description cannot be empty");
      return false;
    }
    const price = parseFloat(priceInSol);
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be greater than 0");
      return false;
    }
    return true;
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const program = getPrograms(wallet);
      const encoder = new TextEncoder();
      
      console.log("Creating experience with:", {
        title,
        location,
        description,
        priceInSol,
        titleLength: title.length,
        locationLength: location.length,
        priceLamports: parseFloat(priceInSol) * LAMPORTS_PER_SOL
      });

      const [experiencePDA] = PublicKey.findProgramAddressSync(
        [
          encoder.encode("experience"),
          publicKey.toBuffer(),
          encoder.encode(title),
        ],
        program.programId
      );

      const priceLamports = new BN(parseFloat(priceInSol) * LAMPORTS_PER_SOL);

      const tx = await program.methods
        .createExperience(title, location, description, priceLamports)
        .accountsStrict({
          organiser: publicKey,
          experience: experiencePDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction signature:", tx);
      toast.success("Experience created successfully!");
      
      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setPriceInSol("");
    } catch (error) {
      console.error("Error creating experience:", error);
      if (error.logs) {
        console.error("Transaction logs:", error.logs);
      }
      // Add more detailed error message
      if (error.message.includes("Assertion failed")) {
        toast.error("Validation failed. Please check title length, location length, and price.");
      } else {
        toast.error(error.message || "Failed to create experience");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreate} className="max-w-md mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create a New Experience</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          maxLength={MAX_TITLE_LEN}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Location</label>
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          maxLength={MAX_LOCATION_LEN}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Price (SOL)</label>
        <input
          type="number"
          placeholder="Enter price in SOL"
          value={priceInSol}
          onChange={(e) => setPriceInSol(e.target.value)}
          step="0.01"
          min="0.01"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full p-2 rounded font-medium ${
          loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Creating..." : "Create Experience"}
      </button>
    </form>
  );
};

export default CreateExperienceForm;
