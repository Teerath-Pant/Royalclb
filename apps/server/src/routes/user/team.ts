import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { withColumnScale } from "@/utils/decimal-scale";
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
    const offset = (page - 1) * limit;

    const [total, rows] = await Promise.all([
      ctx.db.meddolic_user_child_ids.count({ where: { member_id: id } }),
      ctx.db.$queryRaw<Record<string, unknown>[]>`
        SELECT a.member_id, a.uid, a.user_id, a.topup_flag, a.date_time, b.level,
          c.user_id AS referralUserId,
          COALESCE((SELECT SUM(amount) FROM recharges WHERE userId = a.member_id), 0) AS totalDeposit
        FROM meddolic_user_child_ids b
        JOIN meddolic_user_details a ON a.member_id = b.child_id
        JOIN meddolic_user_details c ON c.member_id = a.sponser_id
        WHERE b.member_id = ${id}
        ORDER BY a.date_time DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
    ]);

    const data = rows.map((row) => ({
      ...row,
      totalDeposit: Number(row.totalDeposit),
    }));

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
    const rows = await ctx.db.$queryRaw<Record<string, unknown>[]>`
      SELECT t2.uid, t2.user_id, t2.phone, t2.topup_flag, t2.date_time
      FROM meddolic_user_child_ids t1
      JOIN meddolic_user_details t2 ON t1.child_id = t2.member_id
      WHERE t1.member_id = ${ctx.user.member_id} AND t1.level <= 6 AND DATE(t2.date_time) = CURDATE()
      ORDER BY t2.date_time DESC
    `;

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
