import { Point } from "./point.ts";
import { PrivateKey } from "./types.ts";
import { Curve, Secp256k1 } from "./curve.ts";
import { getRandomNumber, int2Hex } from "./utils.ts";

export class ECC {
  readonly sk: bigint;
  readonly pk: Point;
  readonly curve: Curve;

  constructor(sk?: PrivateKey, curve?: Curve) {
    this.curve = new Secp256k1();
    if (curve) {
      this.curve = curve;
    }

    const privateKey = sk || getRandomNumber(32, this.curve.n);

    const G = new Point(this.curve, this.curve.gx, this.curve.gy);
    const publicKey = G.scalarMul(privateKey);

    this.sk = privateKey;
    this.pk = publicKey;
  }

  // See: https://datatracker.ietf.org/doc/html/rfc5480
  getPublicKey(): string {
    const x = int2Hex(this.pk.x, false);
    const y = int2Hex(this.pk.y, false);
    return `0x04${x}${y}`;
  }
}
