import crypto from "node:crypto";

import type { winGo } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleRandom = {
  id: winGo["id"];
};

export const handleRandom = async ({ id }: HandleRandom) => {
  const winNumber = crypto.randomInt(0, 10);
  await handleWinAndLose({ id, winNumber });
};
