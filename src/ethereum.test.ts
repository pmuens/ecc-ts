import { expect } from "$std/expect/mod.ts";
import { describe, it } from "$std/testing/bdd.ts";
import {
  decodeRlp,
  isAddress,
  recoverAddress,
  Signature,
  Transaction,
  verifyMessage,
  Wallet,
} from "$ethers";

import { ECDSA } from "./ethereum.ts";
import { Point } from "./point.ts";
import { int2Hex } from "./utils.ts";

describe("Ethereum ECDSA", () => {
  it("should compute a correct address", async () => {
    const ecdsa = new ECDSA();
    const address = await ecdsa.getAddress();

    const isValid = isAddress(address);

    expect(isValid).toBe(true);
  });

  it("should generate a valid message signature", async () => {
    const privateKey = BigInt(
      "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    );

    const message = new Uint8Array([0, 1, 2, 3, 4]);

    const ecdsa = new ECDSA(privateKey);
    const address = await ecdsa.getAddress();

    const signature = await ecdsa.signMessage(message);

    const r = signature.r;
    const s = signature.s;
    const v = signature.v!;

    const recoveredAddress = verifyMessage(
      message,
      Signature.from({
        r: int2Hex(r),
        s: int2Hex(s),
        v,
      }),
    );

    expect(
      address.toLocaleLowerCase(),
    ).toBe(
      recoveredAddress.toLocaleLowerCase(),
    );
  });

  it("should verify a valid message signature", async () => {
    const privateKey =
      "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";

    const message = new Uint8Array([0, 1, 2, 3, 4]);

    const signer = new Wallet(privateKey);
    const signature = signer.signMessageSync(message);

    // Deserialize uncompressed public key.
    const { publicKey: rawPublicKey } = signer.signingKey;
    const publicKey = rawPublicKey.slice(4, rawPublicKey.length); // Remove trailing `0x04`.
    const x = `0x${publicKey.slice(0, publicKey.length / 2)}`; // The x-value is the first half.
    const y = `0x${publicKey.slice(publicKey.length / 2, publicKey.length)}`; // The y-value is the second half.

    // Deserialize signature (one hex value = 1 nibble).
    const r = `0x${signature.slice(2, 66)}`; // 66 - 2 = 64 (nibbles) -> 64 * 4 = 256 bit.
    const s = `0x${signature.slice(66, 130)}`; // 130 - 66 = 64 (nibbles) -> 64 * 4 = 256 bit.

    const ecdsa = new ECDSA();
    const pk = new Point(ecdsa.curve, BigInt(x), BigInt(y));

    const isValid = await ecdsa.verifyMessage(pk, message, {
      r: BigInt(r),
      s: BigInt(s),
    });

    expect(isValid).toBe(true);
  });

  it("should generate a valid transaction signature", async () => {
    const privateKey = BigInt(
      "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f",
    );

    const ecdsa = new ECDSA(privateKey);
    const address = await ecdsa.getAddress();

    const serializedTx = Transaction.from({
      to: "0x6502a0EC977DE9C2d4E3864A8D6Cc07E38646E6f",
      value: 1n,
    });

    const signature = await ecdsa.sign(serializedTx.unsignedHash);

    const r = signature.r;
    const s = signature.s;
    const v = signature.v!;

    serializedTx.signature = Signature.from({
      r: int2Hex(r),
      s: int2Hex(s),
      v,
    });

    const recoveredAddress = recoverAddress(
      serializedTx.unsignedHash,
      serializedTx.signature,
    );

    expect(
      address.toLocaleLowerCase(),
    ).toBe(
      recoveredAddress.toLocaleLowerCase(),
    );
  });

  it("should verify a valid transaction signature", async () => {
    const privateKey =
      "0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";

    const serializedTx = Transaction.from({
      to: "0x6502a0EC977DE9C2d4E3864A8D6Cc07E38646E6f",
      value: 1n,
    });

    const signer = new Wallet(privateKey);
    const signature = await signer.signTransaction(serializedTx);

    // Deserialize uncompressed public key.
    const { publicKey: rawPublicKey } = signer.signingKey;
    const publicKey = rawPublicKey.slice(4, rawPublicKey.length); // Remove trailing `0x04`.
    const x = `0x${publicKey.slice(0, publicKey.length / 2)}`; // The x-value is the first half.
    const y = `0x${publicKey.slice(publicKey.length / 2, publicKey.length)}`; // The y-value is the second half.

    // Deserialize signature.
    const rlp = signature.slice(4);
    const decoded = decodeRlp(`0x${rlp}`);
    const r = decoded[decoded.length - 2] as string;
    const s = decoded[decoded.length - 1] as string;

    const ecdsa = new ECDSA();
    const pk = new Point(ecdsa.curve, BigInt(x), BigInt(y));

    const isValid = await ecdsa.verifyTransaction(
      pk,
      serializedTx.unsignedHash,
      {
        r: BigInt(r),
        s: BigInt(s),
      },
    );

    expect(isValid).toBe(true);
  });
});
