export function generateLotteryToken(): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const getRandomSegment = () =>
    Array.from(
      { length: 4 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");

  return `${getRandomSegment()}-${getRandomSegment()}-${getRandomSegment()}`;
}
