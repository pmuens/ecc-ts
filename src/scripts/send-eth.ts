import { InfuraProvider } from "$ethers";

import { Signer } from "../signer.ts";

const { log } = console;
const NETWORK = "sepolia";

async function main() {
  let sk = undefined;
  const key = Deno.env.get("PRIVATE_KEY");
  if (key) {
    sk = BigInt(key);
  }

  if (!sk) {
    throw new Error("PRIVATE_KEY environment variable not set...");
  }

  const provider = new InfuraProvider(NETWORK);
  const signer = new Signer(sk, provider);

  const tx = await signer.sendTransaction({
    to: "0x7b18fcc1a9dfa32f72114483e87e70cc5c29ba31",
    value: 10n,
  });

  log(`TX Hash: ${tx.hash}`);
}

Promise.resolve(main()).catch(console.error);
