import type { andarBahar_result, andarBahar } from "@/lib/prisma";

import { OPTIONS } from "./handle-random";
import { handleWinAndLose } from "./handle-win-lose";

type HandleManual = {
  id: andarBahar["id"];
  mode: string;
};

export const handleManual = async ({ id, mode }: HandleManual) => {
  const result: andarBahar_result = OPTIONS.includes(mode as andarBahar_result)
    ? (mode as andarBahar_result)
    : "ANDAR";

  await handleWinAndLose({
    id,
    result,
  });
};
