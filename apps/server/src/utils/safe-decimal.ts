import { Decimal } from "decimal.js";

export const safeDecimal = (value?: string | number | Decimal | null) =>
  new Decimal(value || 0);
