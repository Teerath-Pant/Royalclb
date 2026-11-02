import { memoize } from "es-toolkit";

import type { trx, trxBets } from "@/lib/prisma";

type GetMultiplierParams = {
  winNumber: NonNullable<trx["winNumber"]>;
  number: trxBets["number"];
  color: trxBets["color"];
  bigSmall: trxBets["bigSmall"];
};

const _getMultipliers = ({
  number,
  color,
  bigSmall,
  winNumber,
}: GetMultiplierParams) => {
  if (number && number === winNumber) {
    return 9;
  }

  if (bigSmall) {
    if (bigSmall === "BIG" && winNumber > 4) {
      return 2;
    } else if (bigSmall === "SMALL" && winNumber < 5) {
      return 2;
    }
  }

  if (color) {
    switch (color) {
      case "RED": {
        if ([2, 4, 6, 8].includes(winNumber)) {
          return 2;
        } else if (winNumber === 0) {
          return 1.5;
        }
        break;
      }

      case "GREEN": {
        if ([1, 3, 7, 9].includes(winNumber)) {
          return 2;
        } else if (winNumber === 5) {
          return 1.5;
        }
        break;
      }

      case "VIOLET": {
        if ([0, 5].includes(winNumber)) {
          return 4.5;
        }
        break;
      }

      default: {
        throw new Error("Invalid case");
      }
    }
  }

  return 0;
};

export const getMultipliers = memoize(_getMultipliers);
