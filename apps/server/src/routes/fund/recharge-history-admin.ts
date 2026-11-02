import { isNumber } from "es-toolkit";
import * as v from "valibot";

import { recharges_method } from "@/lib/prisma";
import type { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { buildDateRangeFilter } from "@/utils/build-date-range-filter";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { dateStringSchema } from "@/utils/valibot";

export const rechargeHistoryAdmin = createFastifyHandler({
  method: "GET",
  path: "/recharge-admin",
  options: { auth: "admin" },
  searchParams: v.object({
    page: v.pipe(v.unknown(), v.toNumber()),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
    status: v.optional(v.picklist(["PENDING", "APPROVED", "REJECTED"])),
    search: v.optional(v.string()),
    fromDate: v.optional(dateStringSchema),
    toDate: v.optional(dateStringSchema),
    method: v.optional(v.enum(recharges_method), "OFFLINE"),
  }),

  async handler({ reply, searchParams, ctx }) {
    const { page, limit, status, search, fromDate, toDate, method } =
      searchParams;
    const offset = (page - 1) * limit;

    const whereCondition: Prisma.rechargesWhereInput = {
      OR: [
        ...(isNumber(search)
          ? [
              {
                meddolic_user_details: {
                  uid: Number(search),
                },
              },
            ]
          : []),
        {
          meddolic_user_details: {
            name: {
              contains: search,
            },
          },
        },
        {
          utrNo: {
            contains: search,
          },
        },
      ],
      status,
      method,
    };

    const dateFilter = buildDateRangeFilter(fromDate, toDate);
    if (dateFilter) {
      whereCondition.createdAt = dateFilter;
    }

    const total = await ctx.db.recharges.count({
      where: whereCondition,
    });

    const recharges = await ctx.db.recharges.findMany({
      where: whereCondition,
      take: limit,
      skip: offset,
      select: {
        id: true,
        amount: true,
        utrNo: true,
        type: true,
        remark: true,
        status: true,
        createdAt: true,
        respondedAt: true,
        meddolic_user_details: {
          select: {
            uid: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const data = recharges.map((r) => ({
      id: r.id,
      uid: r.meddolic_user_details.uid,
      name: r.meddolic_user_details.name,
      amount: r.amount.toFixed(2),
      utrNo: r.utrNo,
      type: r.type,
      remark: r.remark,
      status: r.status,
      createdAt: r.createdAt,
      respondedAt: r.respondedAt,
    }));

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Recharge History Fetched Successfully",
      data: { totalPages, currentPage: page, total, data },
    });
  },
});
