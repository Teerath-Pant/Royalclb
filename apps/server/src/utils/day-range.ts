export const todayIst = () =>
  new Date()
    .toLocaleDateString("en-GB", { timeZone: "Asia/Kolkata" })
    .replaceAll("/", "-");

const toIsoDate = (value: string) => value.split("-").reverse().join("-");

export const dayRange = (fromDate: string, toDate: string) => ({
  gte: new Date(`${toIsoDate(fromDate)}T00:00:00.000Z`),
  lte: new Date(`${toIsoDate(toDate)}T23:59:59.999Z`),
});
