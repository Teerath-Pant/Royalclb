import { sample } from "es-toolkit";

import type { andarBahar } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleRandom = {
  id: andarBahar["id"];
};

export const OPTIONS = ["ANDAR", "BAHAR"] as const;

export const handleRandom = async ({ id }: HandleRandom) => {
  const result = sample(OPTIONS);
  await handleWinAndLose({ id, result });
};
