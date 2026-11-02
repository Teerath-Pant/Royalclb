import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getUserWalletAdmin = createFastifyHandler({
  method: "GET",
  path: "/user-wallet-admin",
  options: { auth: "admin" },
  searchParams: v.object({
    userId: v.pipe(v.string(), v.minLength(1)),
  }),

  async handler({ reply, searchParams, ctx }) {
    const { userId } = searchParams;

    const user = await ctx.db.meddolic_user_details.findFirst({
      where: { user_id: userId, user_type: 2, account_status: 1 },
      select: {
        name: true,
        wallet: true,
        fundWallet: true,
        bonusWallet: true,
      },
    });

    if (!user) {
      throw AppError.notFound({ message: "Invalid or suspended user" });
    }

    return AppResponse.success(reply, {
      message: "User wallet details fetched successfully",
      data: user,
    });
  },
});
