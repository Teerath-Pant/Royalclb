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
