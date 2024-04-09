import { ethers, Signature, Transaction, TransactionLike } from "$ethers";

import { int2Hex } from "./utils.ts";
import { PrivateKey } from "./types.ts";
import { ECDSA, serialize } from "./ethereum.ts";

export class Signer extends ethers.AbstractSigner {
  readonly sk: PrivateKey;
  readonly provider: ethers.Provider | null;
  readonly ecdsa: ECDSA;

  constructor(sk: PrivateKey, provider: ethers.Provider | null) {
    super();

    this.sk = sk;
    this.provider = provider;
    this.ecdsa = new ECDSA(sk);
  }

  async getAddress(): Promise<string> {
    return this.ecdsa.getAddress();
  }

  connect(provider: ethers.Provider | null): ethers.Signer {
    return new Signer(this.sk, provider);
  }

  async signTransaction(tx: ethers.TransactionRequest): Promise<string> {
    const serializedTx = Transaction.from(<TransactionLike<string>> tx);

    const signature = await this.ecdsa.sign(serializedTx.unsignedHash);
    serializedTx.signature = Signature.from({
      r: int2Hex(signature.r),
      s: int2Hex(signature.s),
      v: signature.v!,
    });

    return serializedTx.serialized;
  }

  async signMessage(message: string | Uint8Array): Promise<string> {
    const signature = await this.ecdsa.signMessage(message);
    return serialize(signature);
  }

  // Note: This is not implemented at the moment as it's not necessary for
  //  typical on-chain transactions.
  signTypedData(
    // deno-lint-ignore no-unused-vars
    domain: ethers.TypedDataDomain,
    // deno-lint-ignore no-unused-vars
    types: Record<string, ethers.TypedDataField[]>,
    // deno-lint-ignore no-unused-vars no-explicit-any
    value: Record<string, any>,
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
}
