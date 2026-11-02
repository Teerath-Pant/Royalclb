import type { lucky100 } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleManual = {
  id: lucky100["id"];
  mode: string;
};

export const handleManual = async ({ id, mode }: HandleManual) => {
  const winNumber = Number.parseInt(mode, 10);

  await handleWinAndLose({
    id,
    winNumber,
  });
};
