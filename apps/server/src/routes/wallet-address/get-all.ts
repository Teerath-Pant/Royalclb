import * as v from "valibot";

import type { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getAll = createFastifyHandler({
  method: "GET",
  path: "/",
  options: { auth: "admin" },
  searchParams: v.object({
    page: v.pipe(v.unknown(), v.toNumber()),
    limit: v.optional(v.pipe(v.unknown(), v.toNumber()), 10),
    search: v.optional(v.string()),
    status: v.optional(v.picklist(["ENABLE", "DISABLE"])),
  }),

  async handler({ reply, searchParams, ctx }) {
    const { page, limit, search, status } = searchParams;
    const offset = (page - 1) * limit;

    const whereCondition: Prisma.walletAddressesWhereInput = {
      address: {
        contains: search,
      },
      status,
    };

    const [total, walletAddresses] = await Promise.all([
      ctx.db.walletAddresses.count({
        where: whereCondition,
      }),
      ctx.db.walletAddresses.findMany({
        where: whereCondition,
        orderBy: {
          id: "desc",
        },
        take: limit,
        skip: offset,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return AppResponse.success(reply, {
      message: "Wallet addresses fetched successfully",
      data: {
        totalPages,
        currentPage: page,
        total,
        data: walletAddresses,
      },
    });
  },
});
