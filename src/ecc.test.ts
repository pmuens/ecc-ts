import { expect } from "$std/expect/mod.ts";
import { describe, it } from "$std/testing/bdd.ts";

import { ECC } from "./ecc.ts";
import { int2Hex } from "./utils.ts";

describe("ECC", () => {
  it("should generate a public key based on a known private key", () => {
    const privateKey = BigInt(
      "0xe32868331fa8ef0138de0de85478346aec5e3912b6029ae71691c384237a3eeb",
    );
    const ecc = new ECC(privateKey);
    const publicKey = ecc.pk;

    expect(
      int2Hex(publicKey.x),
    ).toBe(
      "0x86b1aa5120f079594348c67647679e7ac4c365b2c01330db782b0ba611c1d677",
    );
    expect(
      int2Hex(publicKey.y),
    ).toBe(
      "0x5f4376a23eed633657a90f385ba21068ed7e29859a7fab09e953cc5b3e89beba",
    );
    expect(
      ecc.getPublicKey(),
    ).toBe(
      "0x0486b1aa5120f079594348c67647679e7ac4c365b2c01330db782b0ba611c1d6775f4376a23eed633657a90f385ba21068ed7e29859a7fab09e953cc5b3e89beba",
    );
  });

  it("should generate a public key based on a random private key", () => {
    const ecc = new ECC();
    const publicKey = ecc.pk;

    expect(int2Hex(publicKey.x)).not.toBeUndefined();
    expect(int2Hex(publicKey.y)).not.toBeUndefined();
    expect(ecc.getPublicKey()).toMatch(/^0x04.+$/);
  });
});
