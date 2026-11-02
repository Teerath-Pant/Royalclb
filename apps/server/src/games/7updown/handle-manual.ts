import type { updown_games } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleManual = {
  id: updown_games["id"];
  mode: string;
};

export const handleManual = async ({ id, mode }: HandleManual) => {
  const [winningDice1, winningDice2] = mode.split(":").map(Number);
  await handleWinAndLose({
    id,
    winningDice1: winningDice1 ?? 0,
    winningDice2: winningDice2 ?? 0,
  });
};
