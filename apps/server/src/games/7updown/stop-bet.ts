import type { updown_games } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { Now } from "@/utils/date";

export const stopBet = async (interval: number, id: updown_games["id"]) => {
  const dt = Now();

  const runningGames = await prisma.updown_games.findMany({
    where: {
      status: "RUNNING",
      id: {
        lte: id,
      },
      interval_min: interval,
    },
    select: {
      id: true,
    },
  });

  const ids = runningGames.map((g) => g.id);

  if (ids.length > 0) {
    await prisma.updown_games.updateMany({
      data: {
        status: "COMPLETED",
        completed_at: dt.toISOString(),
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
