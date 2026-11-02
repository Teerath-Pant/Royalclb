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
        game: "ANIMAL_ROULETTE",
      },
    }
  );

  const periodId = dt.format("YYYYMMDD") + settings.nextPeriodId;

  const game = await prisma.animal.create({
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
        game: "ANIMAL_ROULETTE",
      },
    }
  );

  return {
    id: game.id,
    periodId,
  };
};
