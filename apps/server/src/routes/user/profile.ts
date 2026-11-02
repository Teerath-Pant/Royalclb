import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";
import { safeDecimal } from "@/utils/safe-decimal";

export const getProfile = createFastifyHandler({
  method: "GET",
  path: "/profile",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const { member_id, uid, user_id, name, phone, email_id, vip, exp } = ctx.user;
    const { bonusWallet, fundWallet, wallet } = ctx.user;

    const roi = await ctx.db.safeInterestLogs.aggregate({
      where: { userId: member_id },
      _sum: { amount: true },
    });

    return AppResponse.success(reply, {
      message: "Profile fetched successfully",
      data: {
        memberId: member_id,
        wallet: wallet.toFixed(2),
        uid: uid ?? member_id,
        referralCode: user_id,
        name,
        phone,
        email: email_id,
        vip,
        exp,
        totalWallet: bonusWallet.plus(fundWallet).plus(wallet).toFixed(2),
        roiIncome: safeDecimal(roi._sum.amount).toFixed(2),
      },
    });
  },
});

export const updateProfile = createFastifyHandler({
  method: "PATCH",
  path: "/profile",
  options: { auth: "user" },
  body: v.object({
    name: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, "Name is required"),
      v.maxLength(255, "Name must be less than 255 characters")
    ),
  }),

  async handler({ reply, body, ctx }) {
    requireUser(ctx);
    await ctx.db.meddolic_user_details.update({
      where: { member_id: ctx.user.member_id },
      data: { name: body.name },
      select: { member_id: true },
    });

    return AppResponse.success(reply, { message: "Profile updated successfully" });
  },
});

export const changePassword = createFastifyHandler({
  method: "POST",
  path: "/change-password",
  options: { auth: "user" },
  body: v.object({
    oldPassword: v.pipe(v.string(), v.minLength(1, "Old password is required")),
    newPassword: v.pipe(
      v.string(),
      v.minLength(4, "Password must be at least 4 characters"),
      v.maxLength(32, "Password must be at most 32 characters")
    ),
  }),

  async handler({ reply, body, ctx }) {
    requireUser(ctx);
    // ponytail: passwords stay plaintext to match /auth/login and the live table. Hash them in one migration, not route by route.
    if (ctx.user.password !== body.oldPassword) {
      throw new AppError("BAD_REQUEST", { message: "Old password is incorrect" });
    }

    await ctx.db.meddolic_user_details.update({
      where: { member_id: ctx.user.member_id },
      data: { password: body.newPassword },
      select: { member_id: true },
    });
    reply.clearCookie("user_token", { path: "/" });

    return AppResponse.success(reply, {
      message: "Password changed, please log in again",
    });
  },
});
