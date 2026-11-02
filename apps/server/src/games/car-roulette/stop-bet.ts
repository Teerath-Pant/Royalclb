import type { carRoulette } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { Now } from "@/utils/date";

export const stopBet = async (interval: number, id: carRoulette["id"]) => {
  const dt = Now();

  const runningGames = await prisma.carRoulette.findMany({
    where: {
      status: "RUNNING",
      id: {
        lte: id,
      },
      interval,
    },
    select: {
      id: true,
    },
  });

  const ids = runningGames.map((g) => g.id);

  if (ids.length > 0) {
    await prisma.carRoulette.updateMany({
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
