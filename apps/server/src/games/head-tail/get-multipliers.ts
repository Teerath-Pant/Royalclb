import type { headTail, headTailBets } from "@/lib/prisma";

type GetMultiplierParams = {
  result: NonNullable<headTail["result"]>;
  betOn: headTailBets["betOn"];
};

export const getMultipliers = ({ result, betOn }: GetMultiplierParams) => {
  // @ts-expect-error: result and betOn types might overlap at runtime
  if (result === betOn) {
    return 2;
  }
  return 0;
};
