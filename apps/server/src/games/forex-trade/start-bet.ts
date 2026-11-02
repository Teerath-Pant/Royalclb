import { prisma } from "@/lib/prisma";
import { gameSettingsService } from "@/services/game-settings.service";
import { Now } from "@/utils/date";

type StartGame = {
  interval: number;
};

export const startBet = async ({ interval }: StartGame) => {
  const dt = Now();

  const settings = await gameSettingsService.get(
    {
      nextPeriodId: true,
    },
    {
      interval_game: {
        interval,
        game: "FOREX_TRADE",
      },
    }
  );

  const periodId = dt.format("YYYYMMDD") + settings.nextPeriodId;

  const game = await prisma.forexTrade.create({
    data: {
      period: periodId,
      intervalMin: interval,
      startedAt: dt.toISOString(),
    },
  });

  await gameSettingsService.set(
    {
      nextPeriodId: {
        increment: 1,
      },
    },
    {
      interval_game: {
        interval,
        game: "FOREX_TRADE",
      },
    }
  );

  return {
    id: game.id,
    period: game.period,
  };
};
