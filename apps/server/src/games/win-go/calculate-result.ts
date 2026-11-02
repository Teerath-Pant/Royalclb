import type { winGo } from "@/lib/prisma";
import { gameSettingsService } from "@/services/game-settings.service";
import { fireAndForget } from "@/utils/fire-and-forget";

import { handleLeast } from "./handle-least";
import { handleManual } from "./handle-manual";
import { handleRandom } from "./handle-random";

type CalculateResult = {
  interval: number;
  ids: winGo["id"][];
};

export const calculateResult = async ({ interval, ids }: CalculateResult) => {
  const { mode } = await gameSettingsService.get(
    { mode: true },
    {
      interval_game: { interval, game: "WIN_GO" },
    }
  );

  for (const id of ids) {
    switch (mode) {
      case "random": {
        handleRandom({ id });
        break;
      }
      case "least": {
        handleLeast({ id });
        break;
      }
      default: {
        handleManual({ id, mode });

        void fireAndForget(
          async () =>
            await gameSettingsService.set(
              { mode: "least" },
              {
                interval_game: { interval, game: "WIN_GO" },
              }
            )
        );
        break;
      }
    }
  }
};
