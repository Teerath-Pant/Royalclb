import type { winGo, winGoBets } from "@/lib/prisma";

import { getMultiplier } from "./get-multiplier";

type Params = {
  winNumber: NonNullable<winGo["winNumber"]>;
  number: winGoBets["number"];
  color: winGoBets["color"];
  bigSmall: winGoBets["bigSmall"];
  betAmount: winGoBets["betAmount"];
};

export const calculateWinAmount = ({
  winNumber,
  number,
  color,
  bigSmall,
  betAmount,
}: Params) => {
  const multiplier = getMultiplier({
    winNumber,
    number,
    color,
    bigSmall,
  });

  return betAmount.mul(multiplier);
};
