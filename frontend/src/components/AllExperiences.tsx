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
    <div style={{ marginTop: "20px", maxWidth: "600px", marginInline: "auto" }}>
      <h2>All Experiences on Chain</h2>
      {loading ? (
        <p>Loading...</p>
      ) : experiences.length === 0 ? (
        <p>No experiences found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {experiences.map((exp, idx) => {
            const account = exp.account;
            const title = account?.title || "Untitled";
            const location = account?.location || "Unknown Location";
            const description =
              account?.description || "No description provided.";
            const lamports = account?.priceLamports?.toString?.() || "0";
            const sol = (Number(lamports) / 1_000_000_000).toFixed(2);

            return (
              <li
                key={idx}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "10px",
                }}
              >
                <h3>{title}</h3>
                <p>
                  <strong>Location:</strong> {location}
                </p>
                <p>
                  <strong>Description:</strong> {description}
                </p>
                <p>
                  <strong>Price:</strong> {sol} SOL
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AllExperiences;
