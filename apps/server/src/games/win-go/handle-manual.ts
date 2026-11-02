import type { winGo } from "@/lib/prisma";

import { handleRandom } from "./handle-random";
import { handleWinAndLose } from "./handle-win-lose";

type HandleManual = {
  id: winGo["id"];
  mode: string;
};

export const handleManual = async ({ id, mode }: HandleManual) => {
  const result = Number.parseInt(mode, 10);

  if (Number.isNaN(result) || result < 0 || result > 9) {
    await handleRandom({ id });
    return;
  }

  await handleWinAndLose({ id, winNumber: result });
};
