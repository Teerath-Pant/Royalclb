import { sample } from "es-toolkit";

import type { carRoulette } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleRandom = {
  id: carRoulette["id"];
};

export const OPTIONS = [
  "BMW",
  "PORSCHE",
  "MUSTANG",
  "LAMBORGHINI",
  "JAGUAR",
  "FERRARI",
  "LAND_ROVER",
  "MERCEDES",
] as const;

export const handleRandom = async ({ id }: HandleRandom) => {
  const result = sample(OPTIONS) ?? "BMW";
  await handleWinAndLose({ id, result });
};
