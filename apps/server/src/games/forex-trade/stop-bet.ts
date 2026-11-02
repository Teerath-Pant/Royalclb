import type { forexTrade } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { Now } from "@/utils/date";

export const stopBet = async (interval: number, id: forexTrade["id"]) => {
  const dt = Now();

  const runningGames = await prisma.forexTrade.findMany({
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
    await prisma.forexTrade.updateMany({
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
