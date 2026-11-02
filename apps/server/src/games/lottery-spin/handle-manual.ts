import type { lottery_spin_bets, lottery_spin_summary } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleManual = {
  id: lottery_spin_summary["id"];
  lotteryId: lottery_spin_bets["id"];
  winAmount: number;
};

export const handleManual = async ({
  id,
  lotteryId,
  winAmount,
}: HandleManual) => {
  await handleWinAndLose({ id, lotteryId, winAmount });
};
