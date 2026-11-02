import * as v from "valibot";

import { Prisma } from "@/lib/prisma";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

import {
  handleType1,
  handleType2,
  handleType3,
  handleType4,
} from "./bet-handlers";

export const placeBet = createFastifyHandler({
  method: "POST",
  path: "/",
  options: { auth: "user" },
  body: v.object({
    listJoin: v.pipe(v.string(), v.trim()),
    type: v.number(),
    xvalue: v.pipe(v.unknown(), v.toNumber()),
    money: v.pipe(v.unknown(), v.toNumber()),
    sessionId: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const dt = Now();
    const { listJoin, type, xvalue, money, sessionId } = body;
    const betAmount = new Prisma.Decimal(xvalue * money);

    const { bonusWallet, wallet, fundWallet, member_id } = ctx.user;

    const totalWallet = bonusWallet.plus(wallet).plus(fundWallet);

    if (ctx.user.topup_flag !== 1) {
      throw AppError.badRequest({
        message: "Recharge Your Wallet First To Play Game.",
      });
    }

    // Calculate total bet amount based on type
    let totalBetAmount = new Prisma.Decimal(0);
    switch (type) {
      case 1: {
        const betsOn = listJoin.split(",");
        totalBetAmount = betAmount.times(betsOn.length);
        break;
      }
      case 2: {
        const [partOne] = listJoin.split("@");
        const betsOn = partOne ? partOne.split(",") : [];
        totalBetAmount = betAmount.times(betsOn.length);
        break;
      }
      case 3: {
        const [partOne, partTwo] = listJoin.split("@");
        const betsOn = partOne ? partOne.split(",") : [];
        const anyIdentical3Amount = partTwo === "3" ? betAmount : 0;
        totalBetAmount = betAmount
          .times(betsOn.length)
          .plus(anyIdentical3Amount);
        break;
      }
      case 4: {
        const [partOne, partTwo, partThree] = listJoin.split("@");
        const different3Amount = partOne ? betAmount : new Prisma.Decimal(0);
        const anyConsecutive3Amount =
          partTwo === "u" ? betAmount : new Prisma.Decimal(0);
        const different2Amount = partThree ? betAmount : new Prisma.Decimal(0);
        totalBetAmount = different3Amount
          .plus(anyConsecutive3Amount)
          .plus(different2Amount);
        break;
      }
      default: {
        throw AppError.badRequest({ message: "Invalid Bet Type" });
      }
    }

    // Check for wallet balance
    if (totalWallet.lessThan(totalBetAmount)) {
      throw AppError.badRequest({ message: "Insufficient balance in wallet." });
    }

    // Process bets based on type
    switch (type) {
      case 1: {
        await handleType1(
          ctx.db,
          listJoin,
          sessionId,
          member_id,
          betAmount,
          dt
        );
        break;
      }
      case 2: {
        await handleType2(
          ctx.db,
          listJoin,
          sessionId,
          member_id,
          betAmount,
          dt
        );
        break;
      }
      case 3: {
        await handleType3(
          ctx.db,
          listJoin,
          sessionId,
          member_id,
          betAmount,
          dt
        );
        break;
      }
      case 4: {
        await handleType4(
          ctx.db,
          listJoin,
          sessionId,
          member_id,
          betAmount,
          dt
        );
        break;
      }
      default: {
        throw AppError.badRequest({ message: "Invalid Bet Type" });
      }
    }

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "Bet Placed Successfully",
    });
  },
});
