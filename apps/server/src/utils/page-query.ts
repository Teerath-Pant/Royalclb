import * as v from "valibot";

/** `?page=&limit=` for list routes; limit is capped so a client can't dump a whole table. */
export const pageQuery = {
  page: v.optional(
    v.pipe(v.unknown(), v.toNumber(), v.integer(), v.minValue(1)),
    1
  ),
  limit: v.optional(
    v.pipe(v.unknown(), v.toNumber(), v.integer(), v.minValue(1), v.maxValue(100)),
    20
  ),
};

export function paged<T>(data: T[], total: number, page: number, limit: number) {
  return { data, total, currentPage: page, totalPages: Math.ceil(total / limit) };
}
