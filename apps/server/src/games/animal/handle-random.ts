import { sample } from "es-toolkit";

import type { animal } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleRandom = {
  id: animal["id"];
};

export const OPTIONS = [
  "TIGER",
  "SNAKE",
  "SHARK",
  "FOX",
  "CHEETAH",
  "BEAR",
  "WHALE",
  "LION",
] as const;

export const handleRandom = async ({ id }: HandleRandom) => {
  const result = sample(OPTIONS);
  await handleWinAndLose({ id, result });
};
