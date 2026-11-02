import type dayjs from "dayjs";

import type { Prisma } from "@/lib/prisma";
import { safeDecimal } from "@/utils/safe-decimal";

type GetTotalBetParams = {
  userId: number;
  from?: dayjs.Dayjs;
  to?: dayjs.Dayjs;
};

export async function getTotalBet(
  db: Prisma.TransactionClient,
  { userId, from, to }: GetTotalBetParams
) {
  const [
    winGoAggregate,
    aviatorAggregate,
    chickenRoadAggregate,
    dragonTigerAggregate,
    carRouletteAggregate,
  ] = await Promise.all([
    db.winGoBets.aggregate({
      _sum: { betAmount: true },
      where: {
        userId,
        dateTime: {
          gte: from?.toISOString(),
          lte: to?.toISOString(),
        },
      },
    }),
    db.aviatorBet.aggregate({
      _sum: { betAmount: true },
      where: {
        userId,
        createdAt: {
          gte: from?.toISOString(),
          lte: to?.toISOString(),
        },
      },
    }),
    db.chickenRoadBet.aggregate({
      _sum: { betAmount: true },
      where: {
        userId,
        createdAt: {
          gte: from?.toISOString(),
          lte: to?.toISOString(),
        },
      },
    }),
    db.dragonTigerBet.aggregate({
      _sum: { betAmount: true },
      where: {
        userId,
        createdAt: {
          gte: from?.toISOString(),
          lte: to?.toISOString(),
        },
      },
    }),
    db.carRouletteBet.aggregate({
      _sum: { betAmount: true },
      where: {
        userId,
        createdAt: {
          gte: from?.toISOString(),
          lte: to?.toISOString(),
        },
      },
    }),
  ]);

  const totalWinGoBet = safeDecimal(winGoAggregate._sum.betAmount);
  const totalAviatorBet = safeDecimal(aviatorAggregate._sum.betAmount);
  const totalChickenRoadBet = safeDecimal(chickenRoadAggregate._sum.betAmount);
  const totalDragonTigerBet = safeDecimal(dragonTigerAggregate._sum.betAmount);
  const totalCarRouletteBet = safeDecimal(carRouletteAggregate._sum.betAmount);

  return totalWinGoBet
    .plus(totalAviatorBet)
    .plus(totalChickenRoadBet)
    .plus(totalDragonTigerBet)
    .plus(totalCarRouletteBet);
}
