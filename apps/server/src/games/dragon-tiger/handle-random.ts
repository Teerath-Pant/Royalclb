import { sample } from "es-toolkit";

import type { dragonTiger_result, dragonTiger } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleRandom = {
  id: dragonTiger["id"];
};

export const OPTIONS: dragonTiger_result[] = ["DRAGON", "TIGER", "TIE"];

export const handleRandom = async ({ id }: HandleRandom) => {
  const winResult = sample(OPTIONS) ?? "TIE";

  await handleWinAndLose({ id, winResult });
};
