import type { lottery_spin_summary } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";
import { Now } from "@/utils/date";

export const stopBet = async (
  interval: number,
  id: lottery_spin_summary["id"]
) => {
  const dt = Now();

  const runningGames = await prisma.lottery_spin_summary.findMany({
    where: {
      status: 1,
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
    await prisma.lottery_spin_summary.updateMany({
      data: {
        status: 0,
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
