import { assert } from "$std/assert/mod.ts";

export function mod(a: bigint, b: bigint) {
  const result = a % b;
  return result >= 0 ? result : result + b;
}

// LSB -> MSB.
export function* toBinary(number: bigint) {
  while (number) {
    yield number & 1n;
    number >>= 1n;
  }
}

// See: https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Pseudocode
// See: https://brilliant.org/wiki/extended-euclidean-algorithm
// Returns [gcd, x, y] such that `(a * x) + (b * y) = gcd` (`gcd` -> `gcd(a, b)`).
export function egcd(a: bigint, b: bigint) {
  let x = 0n;
  let y = 1n;
  let u = 1n;
  let v = 0n;

  while (a !== 0n) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a;
    a = r;
    x = u;
    y = v;
    u = m;
    v = n;
  }

  const gcd = b;

  return [gcd, x, y];
}

// Returns multiplicative inverse of `number` modulo `modulus`.
// Returns integer `x` s.th. `(number * x) % modulus === 1`.
export function inverseOf(number: bigint, modulus: bigint) {
  const a = mod(number, modulus);
  const [gcd, x, y] = egcd(a, modulus);

  if (gcd !== 1n) {
    // Either `number` is 0 or `modulus` is not prime.
    throw new Error(
      `${number} has no multiplicative inverse modulo ${modulus}...`,
    );
  }

  assert(mod(number * x, modulus) === 1n);
  assert(mod(number * x + modulus * y, modulus) === gcd);

  return mod(x, modulus);
}
