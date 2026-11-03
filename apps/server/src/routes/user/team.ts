import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { withColumnScale } from "@/utils/decimal-scale";
import { istDayRange } from "@/utils/date";
import { pageQuery, paged } from "@/utils/page-query";
import { requireUser } from "@/utils/require-user";

const memberSelect = {
  uid: true,
  user_id: true,
  phone: true,
  topup_flag: true,
  date_time: true,
} as const;

export const getDirectTeam = createFastifyHandler({
  method: "GET",
  path: "/direct",
  options: { auth: "user" },
  searchParams: v.object(pageQuery),

  async handler({ reply, searchParams, ctx }) {
    requireUser(ctx);
    const { page, limit } = searchParams;
    const where = { sponser_id: ctx.user.member_id };

    const [total, rows] = await Promise.all([
      ctx.db.meddolic_user_details.count({ where }),
      ctx.db.meddolic_user_details.findMany({
        where,
        select: memberSelect,
        orderBy: { date_time: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    return AppResponse.success(reply, {
      message: "Direct team fetched successfully",
      data: paged(rows, total, page, limit),
    });
  },
});

export const getTeam = createFastifyHandler({
  method: "GET",
  path: "/team",
  options: { auth: "user" },
  searchParams: v.object(pageQuery),

  async handler({ reply, searchParams, ctx }) {
    requireUser(ctx);
    const { page, limit } = searchParams;
    const id = ctx.user.member_id;
    const childRelation = "meddolic_user_details_meddolic_user_child_ids_child_idTomeddolic_user_details";

    const [total, rows] = await Promise.all([
      ctx.db.meddolic_user_child_ids.count({ where: { member_id: id } }),
      ctx.db.meddolic_user_child_ids.findMany({
        where: { member_id: id },
        select: {
          level: true,
          [childRelation]: {
            select: {
              member_id: true,
              uid: true,
              user_id: true,
              topup_flag: true,
              date_time: true,
              meddolic_user_details: { select: { user_id: true } },
            },
          },
        },
        orderBy: { [childRelation]: { date_time: "desc" } },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    const deposits = await ctx.db.recharges.groupBy({
      by: ["userId"],
      where: { userId: { in: rows.map((row) => row[childRelation].member_id) } },
      _sum: { amount: true },
    });
    const depositOf = new Map(deposits.map((d) => [d.userId, d._sum.amount?.toNumber() ?? 0]));

    const data = rows.map((row) => {
      const child = row[childRelation];
      return {
        member_id: child.member_id,
        uid: child.uid,
        user_id: child.user_id,
        topup_flag: child.topup_flag,
        date_time: child.date_time,
        level: row.level,
        referralUserId: child.meddolic_user_details?.user_id ?? null,
        totalDeposit: depositOf.get(child.member_id) ?? 0,
      };
    });

    return AppResponse.success(reply, {
      message: "Team fetched successfully",
      data: paged(data, total, page, limit),
    });
  },
});

export const getNewRegistrations = createFastifyHandler({
  method: "GET",
  path: "/new-registrations",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const rows = await ctx.db.meddolic_user_details.findMany({
      where: {
        date_time: istDayRange(),
        meddolic_user_child_ids_meddolic_user_child_ids_child_idTomeddolic_user_details: {
          some: { member_id: ctx.user.member_id, level: { lte: 6 } },
        },
      },
      select: memberSelect,
      orderBy: { date_time: "desc" },
    });

    return AppResponse.success(reply, {
      message: "New registrations fetched successfully",
      data: rows,
    });
  },
});

export const getStatement = createFastifyHandler({
  method: "GET",
  path: "/statement",
  options: { auth: "user" },
  searchParams: v.object(pageQuery),

  async handler({ reply, searchParams, ctx }) {
    requireUser(ctx);
    const { page, limit } = searchParams;
    const where = { user_id: ctx.user.member_id };

    const [total, rows] = await Promise.all([
      ctx.db.wallet_statements.count({ where }),
      ctx.db.wallet_statements.findMany({
        where,
        select: {
          id: true,
          amount: true,
          note: true,
          type: true,
          wallet_type: true,
          date_time: true,
        },
        orderBy: { date_time: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    return AppResponse.success(reply, {
      message: "Wallet statement fetched successfully",
      data: paged(
        rows.map((row) => withColumnScale("wallet_statements", row)),
        total,
        page,
        limit
      ),
    });
  },
});
