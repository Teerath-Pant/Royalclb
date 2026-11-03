import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toDateTimeString } from "@/utils/date";
import { pageQuery, paged } from "@/utils/page-query";

export const getMembers = createFastifyHandler({
  method: "GET",
  path: "/admin/members",
  options: { auth: "admin" },
  searchParams: v.object({ user_id: v.optional(v.string()), ...pageQuery }),

  async handler({ reply, searchParams, ctx }) {
    const db = ctx.db.meddolic_user_details;
    const { page, limit } = searchParams;
    let userId = searchParams.user_id;
    let invalidUserId = false;

    if (userId && userId !== "0" && (await db.count({ where: { user_id: userId } })) === 0) {
      invalidUserId = true;
      userId = undefined;
    }

    const where = {
      member_id: { not: 1 },
      user_type: 2,
      ...(userId && userId !== "0" ? { user_id: userId } : {}),
    };

    const [total, rows] = await Promise.all([
      db.count({ where }),
      db.findMany({
        where,
        orderBy: { member_id: "desc" },
        include: { meddolic_user_details: { select: { name: true, user_id: true } } },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    const members = rows.map((m) => ({
      memberId: m.member_id,
      uid: m.uid,
      userId: m.user_id,
      name: m.name,
      phone: m.phone,
      password: m.password,
      sponser: `${m.meddolic_user_details?.name ?? ""} (User ID:${m.meddolic_user_details?.user_id ?? ""})`,
      fundWallet: m.fundWallet.toFixed(2),
      wallet: m.wallet.toFixed(2),
      bonusWallet: m.bonusWallet.toFixed(2),
      totalWallet: m.fundWallet.plus(m.wallet).plus(m.bonusWallet).toFixed(2),
      dateTime: toDateTimeString(m.date_time),
      accountStatus: m.account_status,
    }));

    return AppResponse.success(reply, { data: { invalidUserId, ...paged(members, total, page, limit) } });
  },
});
