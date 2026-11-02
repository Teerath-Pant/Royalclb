import { Decimal } from "decimal.js";
import * as v from "valibot";

import { safeDecimal } from "./safe-decimal";

export const decimalSchema = v.pipe(
  v.union([v.string(), v.number()]),
  v.transform((val) => new Decimal(val)),
  v.check((d) => d.isFinite(), "Must be a finite number")
);

export const createPrimaryKeySchema = (message = "Invalid ID") =>
  v.pipe(
    v.unknown(),
    v.toNumber(message),
    v.integer(message),
    v.gtValue(0, message)
  );

export const createAmountSchema = (message = "Invalid amount") =>
  v.pipe(
    v.number(message),
    v.minValue(0, message),
    v.transform((val) => safeDecimal(val))
  );

const ddmmyyyy = /^(?<day>\d{2})-(?<month>\d{2})-(?<year>\d{4})$/u;

export const dateStringSchema = v.pipe(
  v.string(),
  v.regex(ddmmyyyy, "Expected dd-mm-yyyy"),
  v.check((val) => {
    const [day, month, year] = val.split("-").map(Number) as [
      number,
      number,
      number,
    ];
    const date = new Date(year, month - 1, day);
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    );
  }, "Invalid calendar date")
);

export function createPaginationSchema(opts?: {
  defaultLimit?: number;
  maxLimit?: number;
}) {
  const defaultLimit = opts?.defaultLimit ?? 20;
  const maxLimit = opts?.maxLimit ?? 100;

  return v.object({
    page: v.optional(
      v.pipe(
        v.string(),
        v.transform((val) => Math.max(1, Number(val) || 1))
      ),
      "1"
    ),
    limit: v.optional(
      v.pipe(
        v.string(),
        v.transform((val) => {
          const n = Number(val) || defaultLimit;
          return Math.min(Math.max(1, n), maxLimit);
        })
      ),
      String(defaultLimit)
    ),
  });
}
