import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toDateTimeString } from "@/utils/date";
import { dayRange, todayIst } from "@/utils/day-range";
import { pageQuery, paged } from "@/utils/page-query";
import { dateStringSchema } from "@/utils/valibot";

const toDisplayDate = (date: Date) => {
  const value = toDateTimeString(date);
  return `${value.slice(8, 10)}-${value.slice(5, 7)}-${value.slice(0, 4)} ${value.slice(11)}`;
};

export const getWalletStatements = createFastifyHandler({
  method: "GET",
  path: "/admin/wallet-statements",
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

    let memberId: number | undefined;
    let invalidUserId = false;

    if (searchParams.user_id) {
      const user = await ctx.db.meddolic_user_details.findFirst({
        select: { member_id: true },
        where: { user_id: searchParams.user_id },
      });

      if (user) {
        memberId = user.member_id;
      } else {
        invalidUserId = true;
      }
    }

    const range = dayRange(fromDate ?? "01-01-1970", toDate ?? "31-12-9999");

    const where = {
      date_time: {
        ...(fromDate ? { gte: range.gte } : {}),
        ...(toDate ? { lte: range.lte } : {}),
      },
      user_id: memberId,
    };

    const [total, statements] = await Promise.all([
      ctx.db.wallet_statements.count({ where }),
      ctx.db.wallet_statements.findMany({
        where,
        orderBy: { date_time: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    const users = await ctx.db.meddolic_user_details.findMany({
      select: { member_id: true, name: true, user_id: true },
      where: { member_id: { in: statements.map((s) => s.user_id) } },
    });
    const userById = new Map(users.map((u) => [u.member_id, u]));

    const rows = statements.map((s, i) => ({
      index: (page - 1) * limit + i + 1,
      id: s.id,
      name: userById.get(s.user_id)?.name ?? "",
      userId: userById.get(s.user_id)?.user_id ?? "",
      walletType: s.wallet_type,
      date: toDisplayDate(s.date_time),
      note: s.note,
      type: s.type,
      amount: s.amount.toFixed(4),
    }));

    return AppResponse.success(reply, { data: { invalidUserId, ...paged(rows, total, page, limit) } });
  },
});
