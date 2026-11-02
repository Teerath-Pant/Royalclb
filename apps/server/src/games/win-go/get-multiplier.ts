import type { winGo, winGoBets } from "@/lib/prisma";

import { BIG_NUMBERS, COLOR_MULTIPLIERS, SMALL_NUMBERS } from "./config";

type Params = {
  winNumber: NonNullable<winGo["winNumber"]>;
  number: winGoBets["number"];
  color: winGoBets["color"];
  bigSmall: winGoBets["bigSmall"];
};

export const getMultiplier = ({
  winNumber,
  number,
  color,
  bigSmall,
}: Params): number => {
  if (number !== null && number === winNumber) {
    return 9;
  }

  if (bigSmall === "BIG" && BIG_NUMBERS.has(winNumber)) {
    return 2;
  }
  if (bigSmall === "SMALL" && SMALL_NUMBERS.has(winNumber)) {
    return 2;
  }

  if (color) {
    return COLOR_MULTIPLIERS[color](winNumber);
  }

  return 0;
};
