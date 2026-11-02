import type dayjs from "dayjs";

import type { meddolic_user_details, Prisma } from "@/lib/prisma";
import { safeDecimal } from "@/utils/safe-decimal";

type TotalRechargeParams = {
  userId: meddolic_user_details["member_id"];
  from?: dayjs.Dayjs;
  to?: dayjs.Dayjs;
};

type TotalRechargeCountParams = {
  userId: meddolic_user_details["member_id"];
  from?: dayjs.Dayjs;
  to?: dayjs.Dayjs;
};

export const fundService = {
  totalRecharge: async (
    db: Prisma.TransactionClient,
    { userId, from, to }: TotalRechargeParams
  ) => {
    const aggregate = await db.recharges.aggregate({
      where: {
        userId,
        status: "APPROVED",
        createdAt: {
          gte: from?.toISOString(),
          lte: to?.toISOString(),
        },
      },
      _sum: {
        amount: true,
      },
    });

    return safeDecimal(aggregate._sum.amount);
  },

  totalRechargeCount: async (
    db: Prisma.TransactionClient,
    { userId, from, to }: TotalRechargeCountParams
  ) =>
    await db.recharges.count({
      where: {
        userId,
        status: "APPROVED",
        createdAt: {
          gte: from?.toISOString(),
          lte: to?.toISOString(),
        },
      },
    }),
};
