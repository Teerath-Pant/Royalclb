import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { createAmountSchema } from "@/utils/valibot";

export const admin_create = createFastifyHandler({
  method: "POST",
  path: "/admin",
  options: { auth: "admin" },
  body: v.object({
    code: v.pipe(
      v.string("Code is required"),
      v.minLength(4, "Code must be at least 4 characters"),
      v.maxLength(64, "Code must be at most 64 characters"),
      v.trim(),
      v.toUpperCase()
    ),
    amount: createAmountSchema("Amount must be a positive number"),
    maxClaims: v.pipe(
      v.number("Max claims is required"),
      v.integer("Max claims must be an integer"),
      v.minValue(1, "Max claims must be at least 1")
    ),
  }),

  async handler({ body, reply, ctx }) {
    const dt = Now();
    const expiresAt = dt.add(24, "hours");

    const giftCode = await ctx.db.$transaction(async (tx) => {
      const existing = await tx.giftCode.findUnique({
        where: { code: body.code },
        select: { id: true },
      });

      if (existing) {
        throw AppError.conflict({
          message: "A gift code with this code already exists",
        });
      }

      return await tx.giftCode.create({
        data: {
          code: body.code,
          amount: body.amount,
          maxClaims: body.maxClaims,
          createdAt: dt.toDate(),
          expiresAt: expiresAt.toDate(),
        },
        select: {
          id: true,
          code: true,
        },
      });
    });

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "Gift code created successfully",
      data: giftCode,
    });
  },
});
