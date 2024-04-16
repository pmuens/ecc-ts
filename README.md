# Elliptic Curve Cryptography

A "from scratch" [Elliptic Curve Cryptography](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography) implementation in [TypeScript](https://www.typescriptlang.org) using the [Deno](https://deno.com) JavaScript runtime.

This repository includes code for the [Elliptic-Curve Diffie-Hellman (ECDH)](https://muens.io/elliptic-curve-diffie-hellman) key agreement protocol as well as the [Elliptic-Curve Digital Signature Algorithm (ECDSA)](https://muens.io/elliptic-curve-digital-signature-algorithm). Both are implemented on top of the [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) curve that's also used in Bitcoin and Ethereum.

In addition to a "raw" ECDSA implementation there's also one that can be used to sign messages and transact on the [Ethereum](https://ethereum.org) Blockchain. To do so easily, an [Ethers](https://github.com/ethers-io/ethers.js) v6 compliant [Signer](https://docs.ethers.org/v6/api/providers/#Signer) was implemented which wraps the ECDSA functionalities.

Note that the code you'll find here **wasn't audited** and is definitely **not constant time**. You should therefore use this codebase as an educational resource which was my intention when I wrote it.

The best way to understand the code is to dive into the [`*.test.ts`](./src) or [script](./src/scripts) files and see how different parts of the code interact.

All the resources I've studied to write this implementation can be found in the [Useful Resources](#useful-resources) section.

## Setup

1. `git clone <url>`
2. `deno test`
3. `deno task dev`

## Scripts

The following are scripts you can run to test the implementation.

Some scripts require you to get some test ETH on Sepolia. There are various faucets available online you can use to get access to testnet ETH.

```sh
# Generate a new private- and public key pair.
deno task keys

# Display information for an existing key pair.
PRIVATE_KEY=0x1234567890 deno task keys

# Get the account balance on the Sepolia test network.
PRIVATE_KEY=0x1234567890 deno task balance

# Sign a message.
PRIVATE_KEY=0x1234567890 deno task sign

# Send ETH to another address on the Sepolia test network.
PRIVATE_KEY=0x1234567890 deno task send
```

## Useful Commands

```sh
deno init

deno info
deno doc [<path>]
deno repl
deno bench <path>
deno compile [-A] <path>

deno fmt [<path>]
deno lint [<path>]
deno test [<path>]

deno run <path>

deno task dev
```

## Useful Resources

- [Wikipedia - Elliptic Curve Cryptography](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography)
- [Wikipedia - Elliptic-Curve Diffie-Hellman](https://en.wikipedia.org/wiki/Elliptic-curve_Diffie–Hellman)
- [Wikipedia - Elliptic Curve Digital Signature Algorithm](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm)
- [Philipp Muens - Elliptic-Curve Diffie-Hellman](https://muens.io/elliptic-curve-diffie-hellman)
- [Anirudha Bose - Roll your own crypto\*](https://onyb.gitbook.io/roll-your-own-crypto)
- [Andrea Corbellini - Elliptic Curve Cryptography: a gentle introduction](https://andrea.corbellini.name/2015/05/17/elliptic-curve-cryptography-a-gentle-introduction)
- [Andrea Corbellini - Elliptic Curve Cryptography: finite fields and discrete logarithms](https://andrea.corbellini.name/2015/05/23/elliptic-curve-cryptography-finite-fields-and-discrete-logarithms)
- [Andrea Corbellini - Elliptic Curve Cryptography: ECDH and ECDSA](https://andrea.corbellini.name/2015/05/30/elliptic-curve-cryptography-ecdh-and-ecdsa)
- [Andrea Corbellini - Elliptic Curve Cryptography: breaking security and a comparison with RSA](https://andrea.corbellini.name/2015/06/08/elliptic-curve-cryptography-breaking-security-and-a-comparison-with-rsa)
- [Paul Miller - Learning fast elliptic-curve cryptography](https://paulmillr.com/posts/noble-secp256k1-fast-ecc)
- [Hyperelliptic - Short Weierstrass curves](http://hyperelliptic.org/EFD/g1p/auto-shortw.html)
- [Bitcoin Wiki - Secp256k1](https://en.bitcoin.it/wiki/Secp256k1)
- [Lucas Henning - The Dark Side of the Elliptic Curve - Signing Ethereum Transactions with AWS KMS in JavaScript](https://luhenning.medium.com/the-dark-side-of-the-elliptic-curve-signing-ethereum-transactions-with-aws-kms-in-javascript-83610d9a6f81)
