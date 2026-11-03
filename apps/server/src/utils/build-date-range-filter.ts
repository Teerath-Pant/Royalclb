import type { Prisma } from "@/lib/prisma";

import { AppError } from "./app-error";

/**
 * Parses dd-mm-yyyy fromDate/toDate strings into a Prisma DateTimeFilter.
 * fromDate -> start of day, toDate -> end of day.
 */
export function buildDateRangeFilter(
  fromDate?: string,
  toDate?: string
): Prisma.DateTimeFilter | undefined {
  if (!fromDate && !toDate) {
    return undefined;
  }

  const filter: Prisma.DateTimeFilter = {};
  if (fromDate) {
    filter.gte = parseDate(fromDate, false);
  }
  if (toDate) {
    filter.lte = parseDate(toDate, true);
  }

  if (filter.gte && filter.lte && filter.gte > filter.lte) {
    throw AppError.badRequest({
      message: "fromDate must be before toDate",
      context: { fromDate, toDate },
    });
  }

  return filter;
}

const parseDate = (dateStr: string, endOfDay: boolean): Date => {
  const [day, month, year] = dateStr.split("-").map(Number) as [
    number,
    number,
    number,
  ];

  // The DB holds IST wall-clock time that Prisma reads as UTC, so the bounds are built in UTC.
  // Local-time bounds shifted the day by the server's UTC offset (5h30 early on an IST machine).
  const date = new Date(Date.UTC(year, month - 1, day));
  const isValidCalendarDate =
    date.getUTCDate() === day &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCFullYear() === year;

  if (!day || !month || !year || !isValidCalendarDate) {
    throw AppError.badRequest({
      message: `Invalid date: ${dateStr}, expected dd-mm-yyyy`,
      context: { dateStr },
    });
  }

  return endOfDay
    ? new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999))
    : date;
};
