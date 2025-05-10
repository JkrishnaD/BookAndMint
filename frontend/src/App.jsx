// src/App.tsx
import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import AllExperiences from "./components/AllExperiences";
import CreateExperience from "./components/createExperience";

import "@solana/wallet-adapter-react-ui/styles.css";
import ExperiencePage from "./pages/ExperiencePage";
import { Toaster } from "sonner";

const App = () => {
  const network = "devnet";
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
        <Toaster position="top-right" richColors />
          <Router>
            <div style={{ padding: "20px" }}>
              <WalletMultiButton />
              <nav style={{ margin: "20px 0" }}>
                <Link to="/" style={{ marginRight: "20px" }}>
                  All Experiences
                </Link>
                <Link to="/create">Create Experience</Link>
              </nav>
              <Routes>
                <Route path="/" element={<AllExperiences />} />
                <Route path="/create" element={<CreateExperience />} />
                <Route path="/experience/:pubkey" element={<ExperiencePage/>}/>
              </Routes>
            </div>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
