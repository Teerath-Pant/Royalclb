import { random } from "es-toolkit";

import type { lucky100 } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleRandom = {
  id: lucky100["id"];
};

export const handleRandom = async ({ id }: HandleRandom) => {
  const winNumber = random(1, 100);
  await handleWinAndLose({ id, winNumber });
};
