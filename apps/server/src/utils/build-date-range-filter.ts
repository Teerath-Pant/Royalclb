import dayjs from "dayjs";

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

  const date = new Date(year, month - 1, day);
  const isValidCalendarDate =
    date.getDate() === day &&
    date.getMonth() === month - 1 &&
    date.getFullYear() === year;

  if (!day || !month || !year || !isValidCalendarDate) {
    throw AppError.badRequest({
      message: `Invalid date: ${dateStr}, expected dd-mm-yyyy`,
      context: { dateStr },
    });
  }

  return endOfDay
    ? dayjs(new Date(year, month - 1, day, 23, 59, 59, 999)).toDate()
    : dayjs(new Date(year, month - 1, day, 0, 0, 0, 0)).toDate();
};
