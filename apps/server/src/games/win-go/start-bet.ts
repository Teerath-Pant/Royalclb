import { prisma } from "@/lib/prisma";
import { gameSettingsService } from "@/services/game-settings.service";
import { Now } from "@/utils/date";

type StartGame = {
  interval: number;
};

export const startBet = async ({ interval }: StartGame) => {
  const dt = Now();

  const settings = await gameSettingsService.get(
    { nextPeriodId: true },
    {
      interval_game: { interval, game: "WIN_GO" },
    }
  );

  const periodId = dt.format("YYYYMMDD") + settings.nextPeriodId;

  await gameSettingsService.set(
    {
      nextPeriodId: { increment: 1 },
    },
    {
      interval_game: { interval, game: "WIN_GO" },
    }
  );

  const game = await prisma.winGo.create({
    data: {
      period: periodId,
      intervalMin: interval,
      startedAt: dt.toISOString(),
      status: "RUNNING",
    },
    select: {
      id: true,
      period: true,
    },
  });

  return game;
};
