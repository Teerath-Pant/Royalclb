import { random } from "es-toolkit";

import type { headTail } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleRandom = {
  id: headTail["id"];
};

export const handleRandom = async ({ id }: HandleRandom) => {
  const result = random(0, 1) === 0 ? "HEAD" : "TAIL";
  await handleWinAndLose({ id, result });
};
