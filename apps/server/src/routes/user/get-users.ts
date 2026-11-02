import { isNumber } from "es-toolkit";
import * as v from "valibot";

import type { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { buildDateRangeFilter } from "@/utils/build-date-range-filter";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { dateStringSchema } from "@/utils/valibot";

export const getUsers = createFastifyHandler({
  method: "GET",
  path: "/",
  options: { auth: "admin" },

  searchParams: v.object({
    page: v.optional(v.pipe(v.unknown(), v.toNumber()), 1),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
    search: v.optional(v.string()),
    fromDate: v.optional(dateStringSchema),
    toDate: v.optional(dateStringSchema),
  }),

  async handler({ reply, searchParams, ctx }) {
    const { page, limit, search, fromDate, toDate } = searchParams;
    const offset = (page - 1) * limit;

    const whereCondition: Prisma.meddolic_user_detailsWhereInput = {
      AND: [
        {
          user_type: 2,
        },
        {
          OR: search
            ? [
                {
                  user_id: {
                    contains: search,
                  },
                },
                ...(isNumber(search)
                  ? [
                      {
                        uid: Number(search),
                      },
                    ]
                  : []),
                {
                  name: {
                    contains: search,
                  },
                },
                {
                  phone: {
                    contains: search,
                  },
                },
              ]
            : [],
        },
      ],
    };

    const dateFilter = buildDateRangeFilter(fromDate, toDate);
    if (dateFilter) {
      whereCondition.date_time = dateFilter;
    }

    const [total, users] = await Promise.all([
      ctx.db.meddolic_user_details.count({
        where: whereCondition,
      }),
      ctx.db.meddolic_user_details.findMany({
        where: whereCondition,
        orderBy: {
          date_time: "desc",
        },
        take: limit,
        skip: offset,
        include: {
          meddolic_user_details: {
            select: {
              uid: true,
              name: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Users fetched successfully",
      data: { totalPages, currentPage: page, total, data: users },
    });
  },
});
