import type { andarBahar, andarBaharBets } from "@/lib/prisma";

type GetMultiplierParams = {
  result: NonNullable<andarBahar["result"]>;
  betOn: andarBaharBets["betOn"];
};

export const getMultipliers = ({ result, betOn }: GetMultiplierParams) => {
  if (result === betOn) {
    return 2;
  }
  return 0;
};
