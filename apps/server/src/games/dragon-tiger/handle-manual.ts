import type { dragonTiger_result, dragonTiger } from "@/lib/prisma";

import { OPTIONS } from "./handle-random";
import { handleWinAndLose } from "./handle-win-lose";

type HandleManual = {
  id: dragonTiger["id"];
  mode: string;
};

export const handleManual = async ({ id, mode }: HandleManual) => {
  const winResult: dragonTiger_result = OPTIONS.includes(
    mode as dragonTiger_result
  )
    ? (mode as dragonTiger_result)
    : "TIE";

  await handleWinAndLose({
    id,
    winResult,
  });
};
