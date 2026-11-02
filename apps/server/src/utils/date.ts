import dayjs from "dayjs";

// export const formatDate = (isoString: Date) => {
//   return dayjs(isoString).format("YYYY-MM-DD hh:mm:ss A");
// };

export const Now = (): dayjs.Dayjs =>
  dayjs().add(5, "hours").add(30, "minutes");
