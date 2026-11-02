import type { cryptoTrade } from "@/lib/prisma";
import { safeDecimal } from "@/utils/safe-decimal";

import { getPrice } from "./get-price";
import { handleWinAndLose } from "./handle-win-lose";

type CalculateResult = {
  ids: cryptoTrade["id"][];
};

export const calculateResult = async ({ ids }: CalculateResult) => {
  for (const id of ids) {
    const [prev, now] = await Promise.all([getPrice(true), getPrice()]);
    const lastPrice = safeDecimal(prev?.price);
    const currentPrice = safeDecimal(now?.price);

    const result = lastPrice.greaterThan(currentPrice)
      ? "DOWN"
      : lastPrice.lessThan(currentPrice)
        ? "UP"
        : "TIE";

    await handleWinAndLose({ id, lastPrice, currentPrice, result });
  }
};
