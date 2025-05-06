import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getPrograms } from "../hooks/get-programs";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, BN } from "@coral-xyz/anchor";
import { Buffer } from "buffer";

const CreateExperienceForm = () => {
  const { publicKey, wallet } = useWallet();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet || !publicKey) return alert("Connect your wallet");

    setLoading(true);

    try {
      const program = getPrograms(wallet);

      const [experiencePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("experience"), publicKey.toBuffer(), Buffer.from(title)],
        program.programId
      );

      await program.methods
        .createExperience(title, location, new BN(price)) // You must match instruction args
        .accounts({
          organiser: publicKey,
        })
        .rpc();

      alert("Experience created!");
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
        type="number"
        placeholder="Price (lamports)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Experience"}
      </button>
    </form>
  );
};

export default CreateExperienceForm;
