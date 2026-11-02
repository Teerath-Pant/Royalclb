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
        game: "CAR_ROULETTE",
      },
    }
  );

  const periodId = dt.format("YYYYMMDD") + settings.nextPeriodId;

  await gameSettingsService.set(
    {
      nextPeriodId: {
        increment: 1,
      },
    },
    {
      interval_game: {
        interval,
        game: "CAR_ROULETTE",
      },
    }
  );

  const game = await prisma.carRoulette.create({
    data: {
      periodId,
      interval,
      createdAt: dt.toISOString(),
    },
    select: {
      id: true,
      periodId: true,
    },
  });

  return game;
};
