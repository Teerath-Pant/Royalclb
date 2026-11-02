import { randomBytes } from "node:crypto";

export function generateOrderId() {
  const random = randomBytes(6).toString("hex").toUpperCase();
  return `ORD-${random}`;
}
