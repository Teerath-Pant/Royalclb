import { randomBytes } from "node:crypto";

import { Decimal } from "decimal.js";

/**
 * Generate a cryptographically secure random Decimal between min and max
 *
 * @param min - lower bound (inclusive)
 * @param max - upper bound
 * @param exclusive - if true, result is [min, max), else [min, max]
 */
export function randomDecimal(
  min: Decimal.Value,
  max: Decimal.Value,
  exclusive = false
): Decimal {
  const minD = new Decimal(min);
  const maxD = new Decimal(max);

  if (minD.gt(maxD)) {
    throw new Error("min cannot be greater than max");
  }

  if (minD.eq(maxD)) {
    return minD;
  }

  // 96 bits of randomness (very high precision)
  const bytes = randomBytes(12);
  const randomInt = new Decimal(
    BigInt(`0x${bytes.toString("hex")}`).toString()
  );
  const maxInt = new Decimal(2).pow(96);

  // random factor in [0, 1)
  let factor = randomInt.div(maxInt);

  // If inclusive max is required, very slightly stretch range
  if (!exclusive) {
    // push factor slightly upward but still safe
    const epsilon = new Decimal(1).div(maxInt);
    factor = factor.plus(epsilon);
  }

  const range = maxD.minus(minD);

  return minD.plus(range.mul(factor));
}
