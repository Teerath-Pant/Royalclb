import type { forexTrade, forexTradeBets } from "@/lib/prisma";

type GetMultiplierParams = {
  result: NonNullable<forexTrade["result"]>;
  betOn: forexTradeBets["betOn"];
};

export const getMultipliers = ({ result, betOn }: GetMultiplierParams) => {
  if (result === betOn) {
    return 2;
  }
  return 0;
};
