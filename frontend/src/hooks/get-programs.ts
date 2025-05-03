import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Idl, web3 } from "@coral-xyz/anchor";
import idl from "../idl/contract.json"
import { Contract } from "../idl/contract";

const network = "https://api.devnet.solana.com";
// export const PROGRAM_ID = new web3.PublicKey("Bby1nh85EANJJLoZnYpkofnvHX4hspQacwaBiMK9GcHJ");

export const getPrograms = (wallet) => {
    const connection = new Connection(network, "confirmed");

    const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: "processed",
    });

    const program = new Program(idl as Contract, provider);

    return program;
}
