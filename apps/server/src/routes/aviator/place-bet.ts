import * as v from "valibot";

import { aviator_status, aviatorBet_side, Prisma } from "@/lib/prisma";
import { incrementAviatorBucketAmount } from "@/ops/aviator";
import { settingsService } from "@/services/settings.service";
import { walletService } from "@/services/wallet.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";
import { decimalSchema } from "@/utils/valibot";

export const placeBet = createFastifyHandler({
  method: "POST",
  path: "/:gameId/bet",
  options: { auth: "user" },
  params: v.object({
    gameId: v.pipe(v.unknown(), v.toNumber()),
  }),
  body: v.object({
    betAmount: decimalSchema,
    side: v.enum(aviatorBet_side),
  }),

  async handler({ params, body, reply, ctx }) {
    requireUser(ctx);
    const dt = Now();

    if (ctx.user.topup_flag !== 1) {
      throw AppError.badRequest({
        message: "Recharge Your Wallet First To Play Game.",
      });
    }

    const { minBetAmount } = await settingsService.get(
      {
        minBetAmount: true,
      },
      ctx.db
    );

    if (body.betAmount.lt(minBetAmount)) {
      throw AppError.badRequest({
        message: `Minimum bet amount is ${minBetAmount.toFixed(2)}`,
      });
    }

    try {
      await ctx.db.$transaction(async (tx) => {
        const { bonusWallet, wallet, fundWallet } = ctx.user;
        const total = bonusWallet.plus(wallet).plus(fundWallet);

        if (total.lt(body.betAmount)) {
          throw AppError.badRequest({ message: "Insufficient balance" });
        }

        const game = await tx.aviator.findUnique({
          where: { id: params.gameId },
          select: { id: true, status: true },
        });

        if (!game) {
          throw AppError.notFound({ message: "Game not found" });
        }

        if (game.status !== aviator_status.BETTING) {
          throw AppError.badRequest({ message: "Betting is closed" });
        }

        const bet = await tx.aviatorBet.create({
          data: {
            gameId: game.id,
            userId: ctx.user.member_id,
            side: body.side,
            betAmount: body.betAmount,
            createdAt: dt.toDate(),
          },
          select: { id: true },
        });

        const { bonusWalletDeduction, fundWalletDeduction, walletDeduction } =
          walletService.calculateWalletDeductions({
            betAmount: body.betAmount,
            bonusWallet,
            fundWallet,
            wallet,
          });

        await walletService.updateWallets2({
          db: tx,
          userId: ctx.user.member_id,
          bonusWalletDeduction,
          walletDeduction,
          fundWalletDeduction,
          dateTime: dt,
          txnId: bet.id,
          note: "BET (Aviator)",
        });

        await incrementAviatorBucketAmount(tx, body.betAmount.mul(0.9));
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw AppError.badRequest({
          message: "You have already placed a bet on this side",
        });
      }

      throw error;
    }

    return AppResponse.success(reply, {
      message: "Bet placed successfully",
    });
  },
});
