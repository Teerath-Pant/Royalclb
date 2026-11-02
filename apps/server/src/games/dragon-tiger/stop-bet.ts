import type { dragonTiger } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { Now } from "@/utils/date";

export const stopBet = async (interval: number, id: dragonTiger["id"]) => {
  const dt = Now();

  const runningGames = await prisma.dragonTiger.findMany({
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
    await prisma.dragonTiger.updateMany({
      data: {
        status: "COMPLETED",
        completedAt: dt.toDate(),
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
