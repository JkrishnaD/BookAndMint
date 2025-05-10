// solanaClient.ts

import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, setProvider, getProvider } from "@coral-xyz/anchor";
import { Wallet } from "@coral-xyz/anchor/dist/cjs/provider";

// Default RPC endpoint
const RPC_URL = "https://api.devnet.solana.com";

// create and return a Connection
export const getConnection = () => {
    return new Connection(RPC_URL, "confirmed");
};

// creates and return an AnchorProvider
export const getAnchorProvider = (wallet: Wallet) => {
    const connection = getConnection();
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
    setProvider(provider); // sets the provider globally for Anchor
    return provider;
};

// Get the current default Anchor provider (if previously set)
export const getCurrentProvider = () => {
    return getProvider();
};

// Utility to convert string to PublicKey safely
export const toPublicKey = (key: string | PublicKey) => {
    return typeof key === "string" ? new PublicKey(key) : key;
};
