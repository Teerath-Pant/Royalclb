import * as v from "valibot";

import { createWalletEntry } from "@/ops/wallet";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

export const claim = createFastifyHandler({
  method: "POST",
  path: "/claim",
  options: { auth: "user" },
  body: v.object({
    code: v.pipe(
      v.string("Code is required"),
      v.minLength(1, "Code is required"),
      v.trim(),
      v.toUpperCase()
    ),
  }),

  async handler({ body, reply, ctx }) {
    requireUser(ctx);
    const dt = Now();

    const result = await ctx.db.$transaction(async (tx) => {
      const giftCode = await tx.giftCode.findUnique({
        where: { code: body.code },
        select: {
          id: true,
          amount: true,
          status: true,
          maxClaims: true,
          claimedCount: true,
          expiresAt: true,
        },
      });

      if (!giftCode) {
        throw AppError.notFound({ message: "Gift code not found" });
      }

      if (giftCode.status !== "ACTIVE") {
        throw AppError.badRequest({
          message:
            giftCode.status === "EXPIRED"
              ? "This gift code has expired"
              : "This gift code has been fully claimed",
        });
      }

      if (dt.toDate() > giftCode.expiresAt) {
        // Mark as EXPIRED if past expiry
        await tx.giftCode.update({
          where: { id: giftCode.id },
          data: { status: "EXPIRED" },
        });
        throw AppError.badRequest({ message: "This gift code has expired" });
      }

      // Check if user already claimed
      const alreadyClaimed = await tx.giftCodeClaim.findUnique({
        where: {
          giftCodeId_userId: {
            giftCodeId: giftCode.id,
            userId: ctx.user.member_id,
          },
        },
      });

      if (alreadyClaimed) {
        throw AppError.conflict({
          message: "You have already claimed this gift code",
        });
      }

      // Create claim record
      await tx.giftCodeClaim.create({
        data: {
          giftCodeId: giftCode.id,
          userId: ctx.user.member_id,
          claimedAt: dt.toDate(),
        },
      });

      // Increment claimedCount
      const newClaimedCount = giftCode.claimedCount + 1;
      const newStatus =
        newClaimedCount >= giftCode.maxClaims ? "DEPLETED" : "ACTIVE";

      await tx.giftCode.update({
        where: { id: giftCode.id },
        data: {
          claimedCount: newClaimedCount,
          status: newStatus,
        },
      });

      // Credit the user's wallet
      await createWalletEntry(tx, {
        userId: ctx.user.member_id,
        refId: giftCode.id,
        amount: giftCode.amount,
        note: "Gift code redeemed",
        type: "CREDIT",
        wallet: "BONUS_WALLET",
        dt,
      });

      return { amount: giftCode.amount };
    });

    return AppResponse.success(reply, {
      message: `Gift code redeemed! ₹${result.amount} has been added to your wallet.`,
      data: result,
    });
  },
});
