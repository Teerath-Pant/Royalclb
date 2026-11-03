import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toIstDateTimeString } from "@/utils/date";
import { pageQuery, paged } from "@/utils/page-query";

export const getAviatorBets = createFastifyHandler({
  method: "GET",
  path: "/admin/bets",
  options: { auth: "admin" },
  searchParams: v.object({
    sessionId: v.pipe(v.unknown(), v.toNumber()),
    ...pageQuery,
  }),

  async handler({ reply, searchParams, ctx }) {
    const { sessionId, page, limit } = searchParams;
    const where = { gameId: sessionId };

    const [total, bets] = await Promise.all([
      ctx.db.aviatorBet.count({ where }),
      ctx.db.aviatorBet.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        include: { meddolic_user_details: { select: { uid: true, name: true } } },
      }),
    ]);

    const rows = bets.map((b, i) => ({
      index: (page - 1) * limit + i + 1,
      id: b.id,
      uid: b.meddolic_user_details.uid,
      name: b.meddolic_user_details.name,
      betAmount: b.betAmount.toFixed(2),
      cashoutMultiplier: b.cashoutMultiplier?.toFixed(2) ?? null,
      winAmount: b.winAmount.toFixed(2),
      tax: b.tax.toFixed(2),
      netAmount: b.netAmount.toFixed(2),
      status: b.status,
      createdAt: toIstDateTimeString(b.createdAt),
    }));

    return AppResponse.success(reply, { data: paged(rows, total, page, limit) });
  },
});
