import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toDateTimeString } from "@/utils/date";
import { dayRange, todayIst } from "@/utils/day-range";
import { pageQuery, paged } from "@/utils/page-query";
import { dateStringSchema } from "@/utils/valibot";

const userSelect = { select: { name: true, user_id: true } } as const;

export const getFundTransfers = createFastifyHandler({
  method: "GET",
  path: "/transfer-history-admin",
  options: { auth: "admin" },
  searchParams: v.object({
    user_id: v.optional(v.string()),
    from_date: v.optional(dateStringSchema),
    to_date: v.optional(dateStringSchema),
    ...pageQuery,
  }),

  async handler({ reply, searchParams, ctx }) {
    const { page, limit } = searchParams;
    const noFilters = !searchParams.user_id && !searchParams.from_date && !searchParams.to_date;
    const fromDate = noFilters ? todayIst() : searchParams.from_date;
    const toDate = noFilters ? todayIst() : searchParams.to_date;

    let senderId: number | undefined;
    let invalidUserId = false;

    if (searchParams.user_id) {
      const sender = await ctx.db.meddolic_user_details.findFirst({
        select: { member_id: true },
        where: { user_id: searchParams.user_id },
      });

      if (sender) {
        senderId = sender.member_id;
      } else {
        invalidUserId = true;
      }
    }

    const range = dayRange(fromDate ?? "01-01-1970", toDate ?? "31-12-9999");

    const where = {
      dateTime: {
        ...(fromDate ? { gte: range.gte } : {}),
        ...(toDate ? { lte: range.lte } : {}),
      },
      senderId,
    };

    const [total, transfers] = await Promise.all([
      ctx.db.fundTransfers.count({ where }),
      ctx.db.fundTransfers.findMany({
        where,
        orderBy: { dateTime: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          meddolic_user_details_fundTransfers_senderIdTomeddolic_user_details: userSelect,
          meddolic_user_details_fundTransfers_receiverIdTomeddolic_user_details: userSelect,
        },
      }),
    ]);

    const rows = transfers.map((t, i) => {
      const sender = t.meddolic_user_details_fundTransfers_senderIdTomeddolic_user_details;
      const receiver = t.meddolic_user_details_fundTransfers_receiverIdTomeddolic_user_details;

      return {
        index: (page - 1) * limit + i + 1,
        id: t.id,
        sender: `${sender.name} ( ${sender.user_id} )`,
        receiver: `${receiver.name} ( ${receiver.user_id} )`,
        amount: t.amount.toFixed(2),
        dateTime: toDateTimeString(t.dateTime),
      };
    });

    return AppResponse.success(reply, { data: { invalidUserId, ...paged(rows, total, page, limit) } });
  },
});
