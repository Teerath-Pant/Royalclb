import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toDateTimeString } from "@/utils/date";
import { dayRange, todayIst } from "@/utils/day-range";
import { pageQuery, paged } from "@/utils/page-query";
import { dateStringSchema } from "@/utils/valibot";

const statuses = { "0": "PENDING", "1": "APPROVED", "2": "REJECTED" } as const;

export const getOnlineDeposits = createFastifyHandler({
  method: "GET",
  path: "/online-deposit-admin",
  options: { auth: "admin" },
  searchParams: v.object({
    withdrawStatus: v.optional(v.string()),
    from_date: v.optional(dateStringSchema),
    to_date: v.optional(dateStringSchema),
    ...pageQuery,
  }),

  async handler({ reply, searchParams, ctx }) {
    const { withdrawStatus, page, limit } = searchParams;
    const fromDate = searchParams.from_date ?? todayIst();
    const toDate = searchParams.to_date ?? todayIst();

    const where = {
      createdAt: dayRange(fromDate, toDate),
      type: "USDT",
      method: "ONLINE",
      status: withdrawStatus ? (statuses[withdrawStatus as keyof typeof statuses] ?? "PENDING") : undefined,
    } as const;

    const [total, recharges] = await Promise.all([
      ctx.db.recharges.count({ where }),
      ctx.db.recharges.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        include: { meddolic_user_details: { select: { user_id: true, name: true } } },
      }),
    ]);

    const rows = recharges.map((r, i) => ({
      index: (page - 1) * limit + i + 1,
      id: r.id,
      username: r.meddolic_user_details.user_id,
      name: r.meddolic_user_details.name,
      amount: r.amount.toFixed(2),
      createdAt: toDateTimeString(r.createdAt),
      status: r.status,
    }));

    return AppResponse.success(reply, { data: paged(rows, total, page, limit) });
  },
});
