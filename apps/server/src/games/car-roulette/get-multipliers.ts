import type { carRoulette, carRouletteBet } from "@/lib/prisma";

type GetMultiplierParams = {
  result: NonNullable<carRoulette["result"]>;
  betOn: carRouletteBet["betType"];
};

export const getMultipliers = ({ result, betOn }: GetMultiplierParams) => {
  if (result === betOn) {
    return 2;
  }
  return 0;
};
