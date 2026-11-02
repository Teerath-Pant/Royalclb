import crypto from "node:crypto";

/**
 * Returns a float in [0,1)
 * Deterministic given (serverSeed, clientSeed, nonce)
 */
export function provablyFairRandom(
  serverSeed: string,
  clientSeed: string,
  nonce: number
): number {
  const hmac = crypto.createHmac("sha256", serverSeed);
  hmac.update(`${clientSeed}:${nonce}`);

  const hash = hmac.digest("hex");
  // 52 bits
  const hex = hash.slice(0, 13);
  const int = Number.parseInt(hex, 16);

  return int / 2 ** 52;
}
