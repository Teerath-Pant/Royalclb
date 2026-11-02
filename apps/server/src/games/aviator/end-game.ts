import type { Decimal } from "decimal.js";

import { aviator_status, aviatorBet_status, prisma } from "@/lib/prisma";
import type { aviator_outcome } from "@/lib/prisma";
import { Now } from "@/utils/date";

export async function endGame(
  gameId: number,
  finalMultiplier: Decimal,
  outcome: aviator_outcome
) {
  await prisma.$transaction(async (tx) => {
    await tx.aviator.update({
      where: { id: gameId },
      data: {
        status: aviator_status.ENDED,
        maxFly: finalMultiplier,
        outcome,
        endedAt: Now().toISOString(),
      },
    });

    await tx.aviatorBet.updateMany({
      where: { gameId, status: aviatorBet_status.PENDING },
      data: { status: aviatorBet_status.LOST },
    });
  });
}
