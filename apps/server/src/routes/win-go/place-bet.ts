import * as v from "valibot";

import { DailyAttendenceBonus } from "@/incomes/daily-attendence-bonus";
import { TradeCommission } from "@/incomes/trade-commission";
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
    number: v.optional(v.pipe(v.unknown(), v.toNumber())),
    color: v.optional(v.picklist(["RED", "GREEN", "VIOLET"])),
    bigSmall: v.optional(v.picklist(["BIG", "SMALL"])),
    betAmount: v.pipe(
      v.unknown(),
      v.toNumber(),
      v.transform((val) => new Prisma.Decimal(val))
    ),
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);

    const { gameId, betAmount, number, color, bigSmall } = body;
    const { bonusWallet, wallet, fundWallet, member_id, topup_flag } = ctx.user;

    const totalWallet = bonusWallet.plus(wallet).plus(fundWallet);

    if (betAmount.lessThan(10)) {
      throw AppError.badRequest({ message: "Min Bet amount is 10." });
    }

    if (topup_flag !== 1) {
      throw AppError.badRequest({
        message: "Recharge Your Wallet First To Play Game.",
      });
    }

    if (totalWallet.lessThan(betAmount)) {
      throw AppError.badRequest({ message: "Insufficient balance in wallet." });
    }

    const game = await ctx.db.winGo.findUnique({
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

    const dt = Now();

    const bet = await ctx.db.winGoBets.create({
      data: {
        gameId,
        userId: member_id,
        number,
        color,
        bigSmall,
        betAmount,
        dateTime: dt.toISOString(),
      },
      select: {
        id: true,
      },
    });

    const txnId = bet.id;
    const { bonusWalletDeduction, fundWalletDeduction, walletDeduction } =
      walletService.calculateWalletDeductions({
        betAmount,
        bonusWallet,
        fundWallet,
        wallet,
      });

    await walletService.updateWallets2({
      userId: member_id,
      bonusWalletDeduction,
      walletDeduction,
      fundWalletDeduction,
      dateTime: dt,
      txnId,
      note: "BET (WinGo)",
    });

    await TradeCommission.create(ctx.db, {
      userId: member_id,
      betAmount,
      dt,
    });

    await DailyAttendenceBonus.release(ctx.db, {
      userId: member_id,
      dt,
    });

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "Bet placed successfully.",
    });
  },
});
