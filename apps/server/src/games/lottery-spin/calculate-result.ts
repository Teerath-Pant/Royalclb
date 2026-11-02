import type { lottery_spin_summary } from "@/lib/prisma";
import { gameSettingsService } from "@/services/game-settings.service";

import { handleManual } from "./handle-manual";
import { handleRandom } from "./handle-random";

type CalculateResult = {
  interval: number;
  ids: lottery_spin_summary["id"][];
};

export const calculateResult = async ({ interval, ids }: CalculateResult) => {
  for (const id of ids) {
    const { mode } = await gameSettingsService.get(
      {
        mode: true,
      },
      {
        interval_game: {
          interval,
          game: "LOTTERY_SPIN",
        },
      }
    );

    switch (mode) {
      case "random": {
        await handleRandom({ id });
        break;
      }
      default: {
        const [lotteryId, amount] = mode.split(":").map(Number);
        await handleManual({
          id,
          lotteryId: lotteryId ?? 0,
          winAmount: amount || 0,
        });
        await gameSettingsService.set(
          {
            mode: "random",
          },
          {
            interval_game: {
              interval,
              game: "LOTTERY_SPIN",
            },
          }
        );
        break;
      }
    }
  }
};
