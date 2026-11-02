import dayjs from "dayjs";
import * as v from "valibot";

import type { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

export const betHistory = createFastifyHandler({
  method: "GET",
  path: "/bet-history",
  options: { auth: "user" },
  searchParams: v.object({
    page: v.pipe(v.unknown(), v.toNumber()),
    interval: v.optional(v.pipe(v.unknown(), v.toNumber())),
    status: v.optional(v.picklist(["PENDING", "WIN", "LOSE"])),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
    from: v.optional(
      v.pipe(
        v.unknown(),
        v.toString(),
        v.transform((d) => dayjs(d))
      )
    ),
    to: v.optional(
      v.pipe(
        v.unknown(),
        v.toString(),
        v.transform((d) => dayjs(d))
      )
    ),
  }),

  async handler({ searchParams, reply, ctx }) {
    requireUser(ctx);
    const { member_id } = ctx.user;
    const { page, limit, interval, status, from, to } = searchParams;
    const offset = (page - 1) * limit;

    const whereCondition: Prisma.cryptoTradeBetsWhereInput = {
      userId: member_id,
      cryptoTrade: {
        intervalMin: interval,
      },
      status: status || { not: "PENDING" },
    };

    if (from || to) {
      const dateConditions: Prisma.DateTimeFilter = {};

      if (from) {
        dateConditions.gte = from.startOf("day").toISOString();
      }

      if (to) {
        dateConditions.lte = to.endOf("day").toISOString();
      }

      whereCondition.dateTime = dateConditions;
    }

    const total = await ctx.db.cryptoTradeBets.count({
      where: whereCondition,
    });

    const games = await ctx.db.cryptoTradeBets.findMany({
      where: whereCondition,
      take: limit,
      skip: offset,
      include: {
        cryptoTrade: {
          select: {
            period: true,
            result: true,
            intervalMin: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Bet History Fetched Successfully",
      data: { totalPages, currentPage: page, total, data: games },
    });
  },
});
