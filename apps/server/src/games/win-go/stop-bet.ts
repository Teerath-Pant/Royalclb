import type { winGo } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { Now } from "@/utils/date";

export const stopBet = async (interval: number, gameId: winGo["id"]) => {
  const dt = Now();

  const runningGameIds = await prisma.winGo
    .findMany({
      where: {
        id: { lte: gameId },
        intervalMin: interval,
        status: "RUNNING",
      },
      select: { id: true },
    })
    .then((games) => games.map((game) => game.id));

  if (runningGameIds.length > 0) {
    await prisma.winGo.updateMany({
      where: { id: { in: runningGameIds } },
      data: {
        status: "COMPLETED",
        completedAt: dt.toISOString(),
      },
    });
  }

  return runningGameIds;
};
