import { memoize } from "es-toolkit";

import type { dragonTigerBet_betType } from "@/lib/prisma";

const _getMultipliers = (betOn: dragonTigerBet_betType) => {
  if (betOn === "TIE") {
    return 3;
  }
  return 2;
};

export const getMultipliers = memoize(_getMultipliers);
