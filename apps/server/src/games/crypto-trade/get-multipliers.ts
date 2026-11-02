import type { cryptoTrade, cryptoTradeBets } from "@/lib/prisma";

type GetMultiplierParams = {
  result: NonNullable<cryptoTrade["result"]>;
  betOn: cryptoTradeBets["betOn"];
};

export const getMultipliers = ({ result, betOn }: GetMultiplierParams) => {
  if (result === betOn) {
    return 2;
  }
  return 0;
};
