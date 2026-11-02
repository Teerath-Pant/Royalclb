import type { cryptoTrade } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { Now } from "@/utils/date";

export const stopBet = async (interval: number, id: cryptoTrade["id"]) => {
  const dt = Now();

  const runningGames = await prisma.cryptoTrade.findMany({
    where: {
      status: "RUNNING",
      id: {
        lte: id,
      },
      intervalMin: interval,
    },
    select: {
      id: true,
    },
  });

  const ids = runningGames.map((g) => g.id);

  if (ids.length > 0) {
    await prisma.cryptoTrade.updateMany({
      data: {
        status: "COMPLETED",
        completedAt: dt.toISOString(),
      },
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  return {
    ids,
  };
};
