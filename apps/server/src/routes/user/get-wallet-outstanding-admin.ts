import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toDateTimeString } from "@/utils/date";
import { pageQuery, paged } from "@/utils/page-query";

export const getWalletOutstanding = createFastifyHandler({
  method: "GET",
  path: "/admin/wallet-outstanding",
  options: { auth: "admin" },
  searchParams: v.object({
    user_id: v.optional(v.string()),
    ...pageQuery,
  }),

  async handler({ reply, searchParams, ctx }) {
    const db = ctx.db.meddolic_user_details;
    const { page, limit } = searchParams;

    let userId = searchParams.user_id;
    let invalidUserId = false;

    if (userId && (await db.count({ where: { user_id: userId } })) === 0) {
      invalidUserId = true;
      userId = undefined;
    }

    const where = { wallet: { gt: 0 }, ...(userId ? { user_id: userId } : {}) };

    const [total, users] = await Promise.all([
      db.count({ where }),
      db.findMany({
        where,
        orderBy: { wallet: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        select: { member_id: true, name: true, user_id: true, wallet: true, fundWallet: true, date_time: true },
      }),
    ]);

    const rows = users.map((u, i) => ({
      index: (page - 1) * limit + i + 1,
      memberId: u.member_id,
      name: u.name,
      userId: u.user_id,
      dateTime: toDateTimeString(u.date_time),
      wallet: u.wallet.toFixed(2),
      fundWallet: u.fundWallet.toFixed(2),
    }));

    return AppResponse.success(reply, { data: { invalidUserId, ...paged(rows, total, page, limit) } });
  },
});
