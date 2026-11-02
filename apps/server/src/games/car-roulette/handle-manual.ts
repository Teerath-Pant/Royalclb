import type { carRoulette_result, carRoulette } from "@/lib/prisma";

import { OPTIONS } from "./handle-random";
import { handleWinAndLose } from "./handle-win-lose";

type HandleManual = {
  id: carRoulette["id"];
  mode: string;
};

export const handleManual = async ({ id, mode }: HandleManual) => {
  const result: carRoulette_result = OPTIONS.includes(
    mode as carRoulette_result
  )
    ? (mode as carRoulette_result)
    : "BMW";

  await handleWinAndLose({
    id,
    result,
  });
};
