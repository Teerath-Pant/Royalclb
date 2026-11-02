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
        game: "DRAGON_TIGER",
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
        game: "DRAGON_TIGER",
      },
    }
  );

  const game = await prisma.dragonTiger.create({
    data: {
      periodId,
      interval,
      createdAt: dt.toDate(),
    },
    select: {
      id: true,
      periodId: true,
    },
  });

  return game;
};
