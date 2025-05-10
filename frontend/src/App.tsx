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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AllExperiences from "./components/AllExperiences";
import CreateExperience from "./components/createExperience";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";

import "@solana/wallet-adapter-react-ui/styles.css";
import ExperiencePage from "./pages/ExperiencePage";
import { Toaster } from "sonner";
import UserProfile from "./pages/UserProfile";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

const App = () => {
  const network = "devnet";
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network: "devnet" as WalletAdapterNetwork })],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
        <Toaster position="top-right" richColors />
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-900">
              <Navbar />
              <div className="flex-grow">
              <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/experiences" element={<AllExperiences />} />
                <Route path="/create" element={<CreateExperience />} />
                  <Route path="/experience/:pubkey" element={<ExperiencePage />} />
                  <Route path="/profile" element={<UserProfile />} />
              </Routes>
              </div>
              <Footer />
            </div>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
