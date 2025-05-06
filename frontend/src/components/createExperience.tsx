import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getPrograms } from "../hooks/get-programs";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

const LAMPORTS_PER_SOL = 1_000_000_000;

const CreateExperienceForm = () => {
  const { publicKey, wallet } = useWallet();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [priceInSol, setPriceInSol] = useState(""); // Keep input in SOL
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    const encoder = new TextEncoder();
    e.preventDefault();
    if (!wallet || !publicKey) return alert("Connect your wallet");

    setLoading(true);

    try {
      const program = getPrograms(wallet);

      const [experiencePDA] = PublicKey.findProgramAddressSync(
        [
          encoder.encode("experience"),
          publicKey.toBuffer(),
          encoder.encode(title),
        ],
        program.programId
      );

      // Convert SOL to lamports
      const priceLamports = new BN(parseFloat(priceInSol) * LAMPORTS_PER_SOL);

      await program.methods
        .createExperience(title, location, description, priceLamports)
        .accountsStrict({
          organiser: publicKey,
          experience: experiencePDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      alert("Experience created!");
      setTitle("");
      setDescription("");
      setLocation("");
      setPriceInSol("");
    } catch (error) {
      console.error("Error creating experience:", error);
      alert("Failed to create experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreate} style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Create a New Experience</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price in SOL"
        value={priceInSol}
        onChange={(e) => setPriceInSol(e.target.value)}
        step="0.01"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Experience"}
      </button>
    </form>
  );
};

export default CreateExperienceForm;
