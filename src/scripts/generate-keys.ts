import { ECDSA } from "../ethereum.ts";
import { int2Hex } from "../utils.ts";

const { log } = console;

async function main() {
  let sk = undefined;
  const key = Deno.env.get("PRIVATE_KEY");
  if (key) {
    sk = BigInt(key);
  }

  const ecdsa = new ECDSA(sk);
  log(`Private Key:\t${int2Hex(ecdsa.sk)}`);
  log(`Public Key (X):\t${int2Hex(ecdsa.pk.x)}`);
  log(`Public Key (Y):\t${int2Hex(ecdsa.pk.y)}`);
  log(`Address:\t${await ecdsa.getAddress()}`);
}

Promise.resolve(main()).catch(console.error);
