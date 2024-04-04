import { assert } from "$std/assert/mod.ts";
import { crypto } from "$std/crypto/mod.ts";

import { ECC } from "./ecc.ts";
import { Point } from "./point.ts";
import { PublicKey, Signature } from "./types.ts";
import {
  buf2hex,
  getRandomNumber,
  int2BytesBe,
  int2Hex,
  inverseOf,
  mod,
} from "./utils.ts";

export class ECDSA extends ECC {
  async signMessage(message: string | Uint8Array): Promise<Signature> {
    return this.sign(await getMessageDigest(message));
  }

  async verifyMessage(
    pk: PublicKey,
    message: string | Uint8Array,
    signature: Signature,
  ): Promise<boolean> {
    const G = new Point(this.curve, this.curve.gx, this.curve.gy);
    const z = await hashDigest(getMessageDigest(message), this.curve.n);

    const u = mod(z * inverseOf(signature.s, this.curve.n), this.curve.n);
    const v = mod(
      signature.r * inverseOf(signature.s, this.curve.n),
      this.curve.n,
    );

    const R = G.scalarMul(u).add(pk.scalarMul(v));

    return mod(signature.r, this.curve.n) === mod(R.x, this.curve.n);
  }

  async verifyTransaction(
    pk: PublicKey,
    digest: string | Uint8Array,
    signature: Signature,
  ): Promise<boolean> {
    const G = new Point(this.curve, this.curve.gx, this.curve.gy);
    let z = await hashDigest(digest, this.curve.n);
    if (typeof digest === "string" && digest.startsWith("0x")) {
      z = BigInt(digest);
    }

    const u = mod(z * inverseOf(signature.s, this.curve.n), this.curve.n);
    const v = mod(
      signature.r * inverseOf(signature.s, this.curve.n),
      this.curve.n,
    );

    const R = G.scalarMul(u).add(pk.scalarMul(v));

    return mod(signature.r, this.curve.n) === mod(R.x, this.curve.n);
  }

  async sign(digest: string | Uint8Array): Promise<Signature> {
    const G = new Point(this.curve, this.curve.gx, this.curve.gy);
    let z = await hashDigest(digest, this.curve.n);
    if (typeof digest === "string" && digest.startsWith("0x")) {
      z = BigInt(digest);
    }

    let r = 0n;
    let s = 0n;
    let R = Point.infinity(this.curve);
    while (r === 0n || s === 0n) {
      const k = getRandomNumber(32, this.curve.n);
      R = G.scalarMul(k);
      r = mod(R.x, this.curve.n);
      s = mod((z + r * this.sk) * inverseOf(k, this.curve.n), this.curve.n);
    }

    // See: https://ethereum.stackexchange.com/a/53182
    // See: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
    let v = R.y & 1n;

    // EIP-2 compliance to combat transaction malleability by ensuring that
    //  `s` is always smaller than half of the curve.
    // See: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2.md
    const halfN = this.curve.n / 2n;
    if (s > halfN) {
      v = v ^ 1n;
      // `s` is on the wrong side of the curve, so flip it.
      //  This works because `s` is a y-coordinate.
      s = mod(-s, this.curve.n);
    }

    v = 27n + v;

    return {
      r,
      s,
      v,
    };
  }

  async getAddress(): Promise<string> {
    let pubKey = this.getPublicKey();

    // Remove first byte which indicates that the key is uncompressed.
    // See: https://github.com/ethereumbook/ethereumbook/blob/develop/04keys-addresses.asciidoc#generating-a-public-key
    pubKey = pubKey.slice(4);

    // Need to turn our hex string back into a `Uint8Array` because in this case `keccak256`
    //  doesn't work with a hex string representation of the public key.
    const x = BigInt(`0x${pubKey.slice(0, pubKey.length / 2)}`);
    const y = BigInt(`0x${pubKey.slice(pubKey.length / 2, pubKey.length)}`);
    const xArr = int2BytesBe(x);
    const yArr = int2BytesBe(y);

    const hashed = new Uint8Array(
      await crypto.subtle.digest(
        "KECCAK-256",
        new Uint8Array([...xArr, ...yArr]),
      ),
    );

    return buf2hex(hashed.slice(-20));
  }
}

export function serialize(signature: Signature) {
  const r = int2Hex(signature.r, false);
  const s = int2Hex(signature.s, false);

  if (signature.v) {
    const v = int2Hex(signature.v, false, false);
    return `0x${r}${s}${v}`;
  }

  return `0x${r}${s}`;
}

// See: https://github.com/ethereum/ercs/blob/master/ERCS/erc-191.md
async function hashDigest(digest: string | Uint8Array, n: bigint) {
  let dgst;
  if (typeof digest === "string") {
    const encoder = new TextEncoder();
    dgst = encoder.encode(digest);
  } else {
    dgst = digest;
  }

  const hash = new Uint8Array(await crypto.subtle.digest("KECCAK-256", dgst));

  const z = BigInt(buf2hex(hash));

  const nBits = BigInt(n.toString(2).length);
  const zBits = BigInt(z.toString(2).length);
  assert(zBits <= nBits);

  return z;
}

function getMessageDigest(message: string | Uint8Array) {
  let msg;
  if (typeof message === "string") {
    const encoder = new TextEncoder();
    msg = encoder.encode(message);
  } else {
    msg = message;
  }

  const encoder = new TextEncoder();
  const prefix = encoder.encode("\x19Ethereum Signed Message:\n");
  const length = encoder.encode(String(msg.length));

  return new Uint8Array([...prefix, ...length, ...msg]);
}
