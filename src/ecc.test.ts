import { describe, it } from "$std/testing/bdd.ts";
import { assertEquals, assertExists, assertMatch } from "$std/assert/mod.ts";

import { ECC } from "./ecc.ts";
import { int2Hex } from "./utils.ts";

describe("ECC", () => {
  it("should generate a public key based on a known private key", () => {
    const privateKey = BigInt(
      "0xe32868331fa8ef0138de0de85478346aec5e3912b6029ae71691c384237a3eeb",
    );
    const ecc = new ECC(privateKey);
    const publicKey = ecc.pk;

    assertEquals(
      int2Hex(publicKey.x),
      "0x86b1aa5120f079594348c67647679e7ac4c365b2c01330db782b0ba611c1d677",
    );
    assertEquals(
      int2Hex(publicKey.y),
      "0x5f4376a23eed633657a90f385ba21068ed7e29859a7fab09e953cc5b3e89beba",
    );
    assertEquals(
      ecc.getPublicKey(),
      "0x0486b1aa5120f079594348c67647679e7ac4c365b2c01330db782b0ba611c1d6775f4376a23eed633657a90f385ba21068ed7e29859a7fab09e953cc5b3e89beba",
    );
  });

  it("should generate a public key based on a random private key", () => {
    const ecc = new ECC();
    const publicKey = ecc.pk;

    assertExists(int2Hex(publicKey.x));
    assertExists(int2Hex(publicKey.y));
    assertMatch(ecc.getPublicKey(), /^0x04.+$/);
  });
});
