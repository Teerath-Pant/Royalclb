import dayjs from "dayjs";
import * as v from "valibot";

import type { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

const STATUS_CODE = {
  PENDING: 0,
  WIN: 1,
  LOSE: 2,
} as const;

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

    const whereCondition: Prisma.meddolic_game_k3_betsWhereInput = {
      member_id,
      status: status ? STATUS_CODE[status] : undefined,
      meddolic_game_k3_summary: interval
        ? { interval_min: interval }
        : undefined,
    };

    if (from || to) {
      const dateConditions: Prisma.DateTimeFilter = {};

      if (from) {
        dateConditions.gte = from.startOf("day").toISOString();
      }

      if (to) {
        dateConditions.lte = to.endOf("day").toISOString();
      }

      whereCondition.date_time = dateConditions;
    }

    const [total, games] = await Promise.all([
      ctx.db.meddolic_game_k3_bets.count({
        where: whereCondition,
      }),
      ctx.db.meddolic_game_k3_bets.findMany({
        where: whereCondition,
        take: limit,
        skip: offset,
        include: {
          meddolic_game_k3_summary: {
            select: {
              game_id: true,
              interval_min: true,
            },
          },
        },
        orderBy: {
          id: "desc",
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Bet History Fetched Successfully",
      data: { totalPages, currentPage: page, total, data: games },
    });
  },
});
