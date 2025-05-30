import idl from "../idl/contract.json";
import { Contract } from "../idl/contract";
import { Program, AnchorProvider, web3, setProvider, getProvider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

const network = "https://api.devnet.solana.com";

const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);
const programId = new PublicKey(idl.address);

export const getPrograms = (wallet) => {
    
    const connection = new web3.Connection(network, "confirmed");

    const provider = new AnchorProvider(connection, wallet.adapter, AnchorProvider.defaultOptions());
    setProvider(provider);

    const anchorProvider = getProvider();
    const program = new Program<Contract>(idl_object, anchorProvider);
    return program;
};

