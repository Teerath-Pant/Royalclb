import type { lucky100 } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { Now } from "@/utils/date";

export const stopBet = async (interval: number, id: lucky100["id"]) => {
  const dt = Now();

  const runningGames = await prisma.lucky100.findMany({
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
    await prisma.lucky100.updateMany({
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
