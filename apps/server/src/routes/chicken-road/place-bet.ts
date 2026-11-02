import crypto from "node:crypto";

import { Decimal } from "decimal.js";
import * as v from "valibot";

import { TradeCommission } from "@/incomes/trade-commission";
import { chickenRoadBet_difficulty } from "@/lib/prisma";
import { walletService } from "@/services/wallet.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

import { MAX_BET, MIN_BET } from "./config";

export const placeBet = createFastifyHandler({
  method: "POST",
  path: "/place-bet",
  options: { auth: "user" },
  body: v.object({
    betAmount: v.pipe(
      v.unknown(),
      v.toNumber(),
      v.transform((val) => new Decimal(val))
    ),
    difficulty: v.enum(chickenRoadBet_difficulty),
    clientSeed: v.optional(v.string()),
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const dt = Now();

    if (ctx.user.topup_flag !== 1) {
      throw AppError.badRequest({
        message: "Recharge Your Wallet First To Play Game.",
      });
    }

    if (body.betAmount.lt(MIN_BET)) {
      throw AppError.badRequest({
        message: `Minimum bet amount is ${MIN_BET.toFixed(2)}`,
      });
    }

    if (body.betAmount.gt(MAX_BET)) {
      throw AppError.badRequest({
        message: `Maximum bet amount is ${MAX_BET.toFixed(2)}`,
      });
    }

    const result = await ctx.db.$transaction(async (tx) => {
      const active = await tx.chickenRoadBet.findFirst({
        where: { userId: ctx.user.member_id, status: "PENDING" },
        select: { id: true },
      });

      if (active) {
        throw AppError.badRequest({
          message: "You already have an active bet",
        });
      }

      const { bonusWallet, wallet, fundWallet } = ctx.user;

      const total = bonusWallet.plus(wallet).plus(fundWallet);

      if (total.lt(body.betAmount)) {
        throw AppError.badRequest({ message: "Insufficient balance" });
      }

      // 🔐 Get active server seed
      const seed = await tx.provablyFairSeed.findFirst({
        where: { isActive: true },
        select: { serverSeed: true, serverSeedHash: true },
      });

      if (!seed) {
        throw AppError.badRequest({ message: "No active server seed" });
      }

      const clientSeed =
        body.clientSeed ?? crypto.randomBytes(16).toString("hex");

      const bet = await tx.chickenRoadBet.create({
        data: {
          userId: ctx.user.member_id,
          betAmount: body.betAmount,
          difficulty: body.difficulty,

          serverSeed: seed.serverSeed,
          serverSeedHash: seed.serverSeedHash,
          clientSeed,
          nonce: 0,
          createdAt: dt.toISOString(),
        },
        select: { id: true, serverSeedHash: true, clientSeed: true },
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
        note: "BET (Chicken Road)",
      });

      await TradeCommission.create(tx, {
        userId: ctx.user.member_id,
        betAmount: body.betAmount,
        dt,
      });

      return bet;
    });

    return AppResponse.success(reply, {
      message: "Bet placed successfully",
      data: {
        betId: result.id,
        serverSeedHash: result.serverSeedHash,
        clientSeed: result.clientSeed,
      },
    });
  },
});
