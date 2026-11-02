import * as v from "valibot";

import { Prisma } from "@/lib/prisma";
import { walletService } from "@/services/wallet.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { generateLotteryToken } from "@/utils/gen-lottery-token";
import { requireUser } from "@/utils/require-user";

export const placeBet = createFastifyHandler({
  method: "POST",
  path: "/",
  options: { auth: "user" },
  body: v.object({
    gameId: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const { gameId } = body;
    const betAmount = new Prisma.Decimal(1);

    const { bonusWallet, wallet, fundWallet, member_id } = ctx.user;

    const totalWallet = bonusWallet.plus(wallet).plus(fundWallet);

    if (totalWallet.lessThan(betAmount)) {
      throw AppError.badRequest({ message: "Insufficient balance in wallet." });
    }

    const game = await ctx.db.lottery_spin_summary.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      throw AppError.notFound({ message: "No game is running currently" });
    }

    if (game.status === 0) {
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

    const bet = await ctx.db.lottery_spin_bets.create({
      data: {
        game_id: gameId,
        member_id,
        lottery_token: generateLotteryToken(),
        bet_amount: betAmount,
        date_time: dt.toISOString(),
      },
      select: {
        id: true,
        lottery_token: true,
      },
    });

    const txnId = bet.id;

    await walletService.updateWallets({
      userId: member_id,
      betAmount,
      bonusWalletDeduction,
      walletDeduction,
      fundWalletDeduction,
      dateTime: dt,
      txnId,
    });

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "Bet placed successfully.",
      data: bet,
    });
  },
});
