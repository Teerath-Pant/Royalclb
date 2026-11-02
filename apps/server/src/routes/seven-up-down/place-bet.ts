import * as v from "valibot";

import { Prisma } from "@/lib/prisma";
import { walletService } from "@/services/wallet.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

export const placeBet = createFastifyHandler({
  method: "POST",
  path: "/",
  options: { auth: "user" },
  body: v.object({
    gameId: v.pipe(v.unknown(), v.toNumber()),
    betOn: v.picklist(["E7", "L7", "G7"]),
    betAmount: v.pipe(
      v.unknown(),
      v.toNumber(),
      v.transform((val) => new Prisma.Decimal(val))
    ),
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const { gameId, betAmount, betOn } = body;
    const { bonusWallet, wallet, fundWallet, member_id } = ctx.user;

    const totalWallet = bonusWallet.plus(wallet).plus(fundWallet);

    if (betAmount.lessThan(1)) {
      throw AppError.badRequest({ message: "Min Bet amount is 1." });
    }

    if (totalWallet.lessThan(betAmount)) {
      throw AppError.badRequest({ message: "Insufficient balance in wallet." });
    }

    const game = await ctx.db.updown_games.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      throw AppError.notFound({ message: "No game is running currently" });
    }

    if (game.status === "COMPLETED") {
      throw AppError.badRequest({ message: "Game is already completed." });
    }

    const { bonusWalletDeduction, fundWalletDeduction, walletDeduction } =
      walletService.calculateWalletDeductions({
        betAmount,
        bonusWallet,
        fundWallet,
        wallet,
      });

    const dt = Now();

    const bet = await ctx.db.updown_bets.create({
      data: {
        game_id: gameId,
        user_id: member_id,
        bet_on: betOn,
        bet_amount: betAmount,
        date_time: dt.toISOString(),
      },
      select: {
        id: true,
      },
    });

    const txnId = bet.id;

    await walletService.updateWallets2({
      userId: member_id,
      bonusWalletDeduction,
      walletDeduction,
      fundWalletDeduction,
      dateTime: dt,
      txnId,
      note: "BET (7 UP-DOWN)",
    });

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "Bet placed successfully.",
    });
  },
});
