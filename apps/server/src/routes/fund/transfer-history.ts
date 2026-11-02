import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const transferHistory = createFastifyHandler({
  method: "GET",
  path: "/transfer",
  options: { auth: "user" },
  searchParams: v.object({
    page: v.pipe(v.unknown(), v.toNumber()),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
  }),

  async handler({ reply, searchParams, ctx }) {
    requireUser(ctx);
    const { member_id, uid } = ctx.user;

    const { page, limit } = searchParams;
    const offset = (page - 1) * limit;

    const total = await ctx.db.fundTransfers.count({
      where: {
        OR: [
          {
            senderId: member_id,
          },
          {
            receiverId: member_id,
          },
        ],
      },
    });

    const histories = await ctx.db.fundTransfers.findMany({
      where: {
        OR: [
          {
            senderId: member_id,
          },
          {
            receiverId: member_id,
          },
        ],
      },
      take: limit,
      skip: offset,
      select: {
        amount: true,
        charge: true,
        netAmount: true,
        dateTime: true,
        meddolic_user_details_fundTransfers_senderIdTomeddolic_user_details: {
          select: {
            uid: true,
            name: true,
          },
        },
        meddolic_user_details_fundTransfers_receiverIdTomeddolic_user_details: {
          select: {
            uid: true,
            name: true,
          },
        },
      },
      orderBy: {
        dateTime: "desc",
      },
    });

    const data = histories.map((history) => {
      const sender =
        history.meddolic_user_details_fundTransfers_senderIdTomeddolic_user_details;
      const receiver =
        history.meddolic_user_details_fundTransfers_receiverIdTomeddolic_user_details;

      return {
        uid,
        amount: history.amount.toFixed(2),
        charge: history.charge.toFixed(2),
        netAmount: history.netAmount.toFixed(2),
        dateTime: history.dateTime,
        sender: {
          uid: sender.uid,
          name: sender.name,
        },
        receiver: {
          uid: receiver.uid,
          name: receiver.name,
        },
      };
    });

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Bet History Fetched Successfully",
      data: { totalPages, currentPage: page, total, data },
    });
  },
});
