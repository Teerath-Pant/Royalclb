import dayjs from "dayjs";
import * as v from "valibot";

import { aviatorBet_status } from "@/lib/prisma";
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
    status: v.optional(v.enum(aviatorBet_status)),
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
    const { page, limit, status, from, to } = searchParams;
    const offset = (page - 1) * limit;

    const whereCondition: Prisma.aviatorBetWhereInput = {
      userId: member_id,
      status,
    };

    if (from || to) {
      const dateConditions: Prisma.DateTimeFilter = {};

      if (from) {
        dateConditions.gte = from.startOf("day").toISOString();
      }

      if (to) {
        dateConditions.lte = to.endOf("day").toISOString();
      }

      whereCondition.createdAt = dateConditions;
    }

    const [total, bets] = await Promise.all([
      ctx.db.aviatorBet.count({ where: whereCondition }),
      ctx.db.aviatorBet.findMany({
        where: whereCondition,
        take: limit,
        skip: offset,
        include: {
          aviator: {
            select: { id: true, outcome: true, maxFly: true },
          },
        },
        orderBy: { id: "desc" },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Bet History Fetched Successfully",
      data: { totalPages, currentPage: page, total, data: bets },
    });
  },
});
