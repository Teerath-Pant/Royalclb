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
        game: "LOTTERY_SPIN",
      },
    }
  );

  const periodId = dt.format("YYYYMMDD") + settings.nextPeriodId;

  const game = await prisma.lottery_spin_summary.create({
    data: {
      period_id: periodId,
      interval_min: interval,
      started_at: dt.toISOString(),
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
        game: "LOTTERY_SPIN",
      },
    }
  );

  return {
    id: game.id,
    periodId,
  };
};
