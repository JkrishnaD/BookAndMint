// src/components/AllExperiences.tsx
import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getPrograms } from "../hooks/get-programs";

const AllExperiences = () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [wallet, publicKey]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>All Experiences on Chain</h2>
      {loading ? (
        <p>Loading...</p>
      ) : experiences.length === 0 ? (
        <p>No experiences found.</p>
      ) : (
        <ul>
          {experiences.map((exp, idx) => (
            <li key={idx} style={{ margin: "10px 0" }}>
              <strong>{exp.account.title}</strong> —{" "}
              {exp.account.price.toString()} lamports
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllExperiences;
