export function getDicePair(need: number): [number, number] {
  if (need < 2 || need > 12) {
    throw new Error("Invalid sum: Dice can only sum between 2 and 12.");
  }

  const dice1 = Math.max(
    1,
    Math.min(6, need - Math.floor(Math.random() * 6 + 1))
  );
  const dice2 = need - dice1;

  return [dice1, dice2];
}
