import * as v from "valibot";

export const API_URL = "/api";

/** Coerces server Decimal / string values to a JS number. */
export const vCoerceNumber = v.pipe(
  v.unknown(),
  v.transform(Number),
  v.number()
);
