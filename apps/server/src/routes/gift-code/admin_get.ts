import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { createPrimaryKeySchema } from "@/utils/valibot";

export const admin_get = createFastifyHandler({
  method: "GET",
  path: "/admin/:id",
  options: { auth: "admin" },
  params: v.object({
    id: createPrimaryKeySchema("Invalid gift code ID"),
  }),

  async handler({ params, reply, ctx }) {
    const giftCode = await ctx.db.giftCode.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        code: true,
        amount: true,
        maxClaims: true,
        claimedCount: true,
        expiresAt: true,
        status: true,
        createdAt: true,
        giftCodeClaim: {
          orderBy: { claimedAt: "desc" },
          select: {
            meddolic_user_details: {
              select: {
                member_id: true,
                name: true,
                user_id: true,
                email_id: true,
              },
            },
          },
        },
      },
    });

    if (!giftCode) {
      throw AppError.notFound({ message: "Gift code not found" });
    }

    return AppResponse.success(reply, {
      message: "Gift code fetched successfully",
      data: giftCode,
    });
  },
});
