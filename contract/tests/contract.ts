import * as anchor from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import IDL from "../target/idl/contract.json";

describe("Booking App Tests", () => {
  let provider: BankrunProvider;
  let program: anchor.Program<Contract>;
  let user: anchor.web3.Keypair;
  let organiser: anchor.web3.Keypair;
  let experiencePda: PublicKey;
  let slotPda: PublicKey;
  let reservationPda: PublicKey;
  let mintPda: PublicKey;
  let metadataPda: PublicKey;
  let userTokenAccount: PublicKey;
  let bump: number;
  let slotBump: number;
  let reservationBump: number;

  const name = "Surf Camp";
  const location = "Goa";
  const priceLamports = new anchor.BN(1_000_000_000); // 1 SOL
  const slotStart = 1680000000;
  const slotEnd = 1680003600;

  before(async () => {
    user = anchor.web3.Keypair.generate();
    organiser = anchor.web3.Keypair.generate();

    const context = await startAnchor(
      "",
      [{ name: "contract", programId: new PublicKey(IDL.address) }],
      [
        {
          address: user.publicKey,
          info: {
            lamports: 2_000_000_000,
            data: Buffer.alloc(0),
            owner: SystemProgram.programId,
            executable: false,
          },
        },
        {
          address: organiser.publicKey,
          info: {
            lamports: 2_000_000_000,
            data: Buffer.alloc(0),
            owner: SystemProgram.programId,
            executable: false,
          },
        },
      ]
    );

    provider = new BankrunProvider(context);
    provider.wallet = new NodeWallet(user);
    anchor.setProvider(provider);
    program = new anchor.Program<Contract>(
      require("../target/idl/contract.json") as Contract,
      provider
    );

    // Derive PDAs
    [experiencePda, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("experience"), organiser.publicKey.toBuffer()],
      program.programId
    );
    [slotPda, slotBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("slot"), experiencePda.toBuffer(), new anchor.BN(slotStart).toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    [reservationPda, reservationBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("reservation"), experiencePda.toBuffer(), new anchor.BN(slotStart).toArrayLike(Buffer, "le", 8)],
      program.programId
    );
  });

  it("should create an experience", async () => {
    await program.methods
      .createExperience(name, location, priceLamports)
      .accounts({
        organiser: organiser.publicKey,
      })
      .signers([organiser])
      .rpc();

    const exp = await program.account.experience.fetch(experiencePda);
    assert.equal(exp.name, name);
    assert.equal(exp.location, location);
    assert.equal(exp.organiser.toBase58(), organiser.publicKey.toBase58());
    assert.equal(Number(exp.priceLamports), priceLamports.toNumber());
  });

  it("should add a time slot", async () => {
    await program.methods
      .addTimeSlot(new anchor.BN(slotStart), new anchor.BN(slotEnd))
      .accounts({
        experience: experiencePda,
      })
      .signers([organiser])
      .rpc();

    const slot = await program.account.timeSlotAccount.fetch(slotPda);
    assert.equal(Number(slot.startTime), slotStart);
    assert.equal(Number(slot.endTime), slotEnd);
    assert.equal(slot.isBooked, false);
  });

  it("should book a slot, mint NFT, and create reservation", async () => {
    const mint = anchor.web3.Keypair.generate();
    mintPda = mint.publicKey;

    userTokenAccount = anchor.utils.token.associatedAddress({
      mint: mintPda,
      owner: user.publicKey,
    });

    [metadataPda] = await PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
        mintPda.toBuffer(),
      ],
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    );

    const sysvarInstructions = new PublicKey(
      "Sysvar1nstructions1111111111111111111111111"
    );

    await program.methods
      .bookSlot(new anchor.BN(slotStart))
      .accounts({
        user: user.publicKey,
        organiser: organiser.publicKey,
        experience: experiencePda,
        mint: mintPda,
        metadata: metadataPda,
        metadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
        sysvarInstructions,
      })
      .signers([user, mint])
      .rpc();

    const reservation = await program.account.reservation.fetch(reservationPda);
    assert.equal(reservation.user.toBase58(), user.publicKey.toBase58());
    assert.equal(reservation.experienceId.toBase58(), experiencePda.toBase58());
    assert.equal(Number(reservation.timeSlot), slotStart);
    assert.equal(reservation.isActive, true);

    const slot = await program.account.timeSlotAccount.fetch(slotPda);
    assert.equal(slot.isBooked, true);

    const tokenAcc = await provider.connection.getTokenAccountBalance(userTokenAccount);
    assert.equal(tokenAcc.value.uiAmount, 1);
  });
});
