import { verifyMessage } from "$ethers";

import { Signer } from "../signer.ts";

const { log } = console;

async function main() {
  let sk = undefined;
  const key = Deno.env.get("PRIVATE_KEY");
  if (key) {
    sk = BigInt(key);
  }

  if (!sk) {
    throw new Error("PRIVATE_KEY environment variable not set...");
  }

  const signer = new Signer(sk, null);

  const message = "Hello World";
  const signature = await signer.signMessage(message);
  const address = verifyMessage(message, signature);

  log(`Signature: ${signature}`);
  log(`Address: ${address}`);
}

Promise.resolve(main()).catch(console.error);
