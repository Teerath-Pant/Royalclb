import { memoize } from "es-toolkit";

import type { updown_bets_bet_on } from "@/lib/prisma";

const _getMultipliers = (betOn: updown_bets_bet_on) => {
  if (betOn === "E7") {
    return 3;
  }
  return 2;
};

export const getMultipliers = memoize(_getMultipliers);
