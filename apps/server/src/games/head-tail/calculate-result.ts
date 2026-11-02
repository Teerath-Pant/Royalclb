import type { lucky100 } from "@/lib/prisma";
import { gameSettingsService } from "@/services/game-settings.service";

import { handleLeast } from "./handle-least";
import { handleManual } from "./handle-manual";
import { handleRandom } from "./handle-random";

type CalculateResult = {
  interval: number;
  ids: lucky100["id"][];
};

export const calculateResult = async ({ interval, ids }: CalculateResult) => {
  const { mode } = await gameSettingsService.get(
    {
      mode: true,
    },
    {
      interval_game: {
        interval,
        game: "HEAD_TAIL",
      },
    }
  );
  for (const id of ids) {
    switch (mode) {
      case "random": {
        await handleRandom({ id });
        break;
      }
      case "least": {
        await handleLeast({ id });
        break;
      }
      default: {
        await handleManual({
          id,
          mode,
        });
        break;
      }
    }
  }
};
