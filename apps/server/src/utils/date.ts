import dayjs from "dayjs";

// export const formatDate = (isoString: Date) => {
//   return dayjs(isoString).format("YYYY-MM-DD hh:mm:ss A");
// };

export const Now = (): dayjs.Dayjs =>
  dayjs().add(5, "hours").add(30, "minutes");

export const toDateTimeString = (date: Date): string =>
  date.toISOString().slice(0, 19).replace("T", " ");

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export const toIstDateTimeString = (date: Date): string =>
  toDateTimeString(new Date(date.getTime() + IST_OFFSET_MS));

/**
 * [start, end) of an IST calendar day, as a Prisma date filter. The DB holds IST wall-clock time
 * and Prisma reads it as UTC, so the bounds are built in UTC from the IST date. 0 = today, -1 = yesterday.
 */
export const istDayRange = (offsetDays = 0) => {
  const ist = new Date(Date.now() + 5.5 * 3_600_000);
  const start = new Date(
    Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate() + offsetDays)
  );
  return { gte: start, lt: new Date(start.getTime() + 86_400_000) };
};
