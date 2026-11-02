import type { winGoBets_color } from "@/lib/prisma";

export const RED_NUMBERS = new Set([2, 4, 6, 8]);
export const GREEN_NUMBERS = new Set([1, 3, 7, 9]);
export const VIOLET_NUMBERS = new Set([0, 5]);
export const BIG_NUMBERS = new Set([5, 6, 7, 8, 9]);
export const SMALL_NUMBERS = new Set([0, 1, 2, 3, 4]);

export const COLOR_MULTIPLIERS: Record<winGoBets_color, (n: number) => number> =
  {
    RED: (n) => (RED_NUMBERS.has(n) ? 2 : n === 0 ? 1.5 : 0),
    GREEN: (n) => (GREEN_NUMBERS.has(n) ? 2 : n === 5 ? 1.5 : 0),
    VIOLET: (n) => (VIOLET_NUMBERS.has(n) ? 4.5 : 0),
  };

export const getColors = (n: number): winGoBets_color[] => {
  if (VIOLET_NUMBERS.has(n)) {
    return n === 0 ? ["VIOLET", "RED"] : ["VIOLET", "GREEN"];
  }
  if (RED_NUMBERS.has(n)) {
    return ["RED"];
  }
  if (GREEN_NUMBERS.has(n)) {
    return ["GREEN"];
  }
  return ["GREEN"];
};
