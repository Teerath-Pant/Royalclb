import * as v from "valibot";
import { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toIstDateTimeString } from "@/utils/date";
import { dayRange, todayIst } from "@/utils/day-range";
import { pageQuery, paged } from "@/utils/page-query";
import { dateStringSchema } from "@/utils/valibot";

export const getAviatorGames = createFastifyHandler({
  method: "GET",
  path: "/admin/games",
  options: { auth: "admin" },
  searchParams: v.object({
    from_date: v.optional(dateStringSchema),
    to_date: v.optional(dateStringSchema),
    ...pageQuery,
  }),

  async handler({ reply, searchParams, ctx }) {
    const { page, limit } = searchParams;
    const fromDate = searchParams.from_date ?? todayIst();
    const toDate = searchParams.to_date ?? todayIst();

    const where = { createdAt: dayRange(fromDate, toDate) };

    const [settings, total, games] = await Promise.all([
      ctx.db.aviatorSettings.findUnique({ where: { id: 1 } }),
      ctx.db.aviator.count({ where }),
      ctx.db.aviator.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    const totals = await ctx.db.aviatorBet.groupBy({
      by: ["gameId"],
      where: { gameId: { in: games.map((g) => g.id) } },
      _count: true,
      _sum: { betAmount: true, winAmount: true, netAmount: true },
    });
    const totalsByGame = new Map(totals.map((t) => [t.gameId, t]));

    const zero = new Prisma.Decimal(0);

    const rows = games.map((g, i) => {
      const t = totalsByGame.get(g.id);
      const betAmount = t?._sum.betAmount ?? null;
      const winAmount = t?._sum.winAmount ?? null;
      const netAmount = t?._sum.netAmount ?? null;
      const adminProfit = (betAmount ?? zero).minus(winAmount ?? zero);
      const ended = g.status === "ENDED";

      return {
        index: (page - 1) * limit + i,
        id: g.id,
        bucketAmount: g.bucketAmount.toFixed(2),
        maxFly: g.maxFly.toFixed(2),
        users: t?._count ?? 0,
        totalBet: betAmount?.toFixed(2) ?? "0.00",
        adminProfit: ended ? adminProfit.toFixed(2) : "0.00",
        adminProfitSign: adminProfit.gt(0) ? 1 : adminProfit.lt(0) ? -1 : 0,
        winningAmount: ended ? (winAmount?.toFixed(2) ?? "0.00") : "0.00",
        userAmount: ended ? (netAmount?.toFixed(2) ?? "0.00") : "0.00",
        status: g.status,
        createdAt: toIstDateTimeString(g.createdAt),
        endedAt: g.endedAt ? toIstDateTimeString(g.endedAt) : "--",
      };
    });

    return AppResponse.success(reply, {
      data: {
        bucket: settings?.bucket.toFixed(2) ?? null,
        fromDate,
        toDate,
        ...paged(rows, total, page, limit),
      },
    });
  },
});
