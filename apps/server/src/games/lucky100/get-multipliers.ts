import type { lucky100, lucky100Bets } from "@/lib/prisma";

type GetMultiplierParams = {
  winNumber: NonNullable<lucky100["winNumber"]>;
  number: lucky100Bets["number"];
  evenOdd: lucky100Bets["evenOdd"];
  bigSmall: lucky100Bets["bigSmall"];
};

export const getMultipliers = ({
  number,
  evenOdd,
  bigSmall,
  winNumber,
}: GetMultiplierParams) => {
  if (number !== null && number === winNumber) {
    return 90;
  }

  if (evenOdd) {
    if (evenOdd === "EVEN" && winNumber % 2 === 0) {
      return 1.9;
    } else if (evenOdd === "ODD" && winNumber % 2 !== 0) {
      return 1.9;
    }
  }

  if (bigSmall) {
    if (bigSmall === "BIG" && winNumber > 50) {
      return 1.9;
    } else if (bigSmall === "SMALL" && winNumber <= 50) {
      return 1.9;
    }
  }

  return 0;
};
