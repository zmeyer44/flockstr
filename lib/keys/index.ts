import { createHmac } from "crypto";
import { ec as EC } from "elliptic";

export function generateSchnorrKeyPair(seed: string): {
  privateKey: string;
  publicKey: string;
} {
  // Use HMAC-SHA256 with your seed as the message and a secret key (salt)
  const hmac = createHmac("sha256", "secret-salt");
  hmac.update(seed);
  const derivedKey = hmac.digest();

  // Create a key pair using the derived private key
  const ec = new EC("secp256k1");
  const keyPair = ec.keyFromPrivate(derivedKey);

  // Get the public key in hexadecimal format
  const publicKey = keyPair.getPublic("hex");

  return {
    privateKey: derivedKey.toString("hex"),
    publicKey,
  };
}
