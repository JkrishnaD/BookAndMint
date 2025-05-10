import { PublicKey } from '@solana/web3.js';
import idl from "../idl/contract.json";

const idl_string = JSON.stringify(idl);

export const getSlotPDA = async (experiencePubkey, slotTime) => {
    const encoder = new TextEncoder();

  return PublicKey.findProgramAddressSync(
    [
      encoder.encode('slot'),
      new PublicKey(experiencePubkey).toBuffer(),
      encoder.encode(slotTime.toString()),
    ],
    new PublicKey(idl.address)
)[0];
};
