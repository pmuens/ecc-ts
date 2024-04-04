import { assertEquals } from "$std/assert/mod.ts";
import { describe, it } from "$std/testing/bdd.ts";

import { egcd, inverseOf, toBinary } from "./utils.ts";

describe("Utils", () => {
  it("toBinary", () => {
    const number = 151n;
    const result = [];

    for (const bit of toBinary(number)) {
      result.push(bit);
    }

    assertEquals(result, [1n, 1n, 1n, 0n, 1n, 0n, 0n, 1n]);
  });

  it("egcd", () => {
    const a = 1432n;
    const b = 123211n;
    const [gcd, x, y] = egcd(a, b);

    assertEquals(gcd, 1n);
    assertEquals(x, -22973n);
    assertEquals(y, 267n);
  });

  it("inverseOf", () => {
    const a = 4n;
    const b = 13n;
    const inverse = inverseOf(a, b);

    assertEquals(inverse, 10n);
  });
});
