import type { animal_result, animal } from "@/lib/prisma";

import { OPTIONS } from "./handle-random";
import { handleWinAndLose } from "./handle-win-lose";

type HandleManual = {
  id: animal["id"];
  mode: string;
};

export const handleManual = async ({ id, mode }: HandleManual) => {
  const result: animal_result = OPTIONS.includes(mode as animal_result)
    ? (mode as animal_result)
    : "TIGER";

  await handleWinAndLose({
    id,
    result,
  });
};
