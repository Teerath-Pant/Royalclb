import { random } from "es-toolkit";

import type { updown_games } from "@/lib/prisma";

import { getDicePair } from "./get-dice-pair";
import { handleWinAndLose } from "./handle-win-lose";

type HandleRandom = {
  id: updown_games["id"];
};

export const handleRandom = async ({ id }: HandleRandom) => {
  const need = random(2, 12);
  const [winningDice1, winningDice2] = getDicePair(need);

  await handleWinAndLose({ id, winningDice1, winningDice2 });
};
