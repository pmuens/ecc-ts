import { ECDH } from "./ecdh.ts";
import { int2Hex } from "./utils.ts";

const { log } = console;

function main() {
  const ecdhAlice = new ECDH();
  const ecdhBob = new ECDH();

  const sharedSecretAlice = ecdhAlice.deriveSecret(ecdhBob.pk);
  const sharedSecretBob = ecdhBob.deriveSecret(ecdhAlice.pk);

  const aliceX = int2Hex(sharedSecretAlice.x).slice(0, 10);
  const aliceY = int2Hex(sharedSecretAlice.y).slice(0, 10);

  const bobX = int2Hex(sharedSecretBob.x).slice(0, 10);
  const bobY = int2Hex(sharedSecretBob.y).slice(0, 10);

  log(`Shared Secret (Alice): (${aliceX}..., ${aliceY}...)`);
  log(`Shared Secret (Bob): (${bobX}..., ${bobY}...)`);
}

main();
