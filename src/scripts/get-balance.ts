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

  const balance = await provider.getBalance(signer.getAddress());

  log(`Balance: ${balance}`);
}

Promise.resolve(main()).catch(console.error);
