import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { buildDateRangeFilter } from "@/utils/build-date-range-filter";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toDateTimeString } from "@/utils/date";
import { pageQuery, paged } from "@/utils/page-query";
import { dateStringSchema } from "@/utils/valibot";

export const getInActiveMembers = createFastifyHandler({
  method: "GET",
  path: "/admin/members/inactive",
  options: { auth: "admin" },
  searchParams: v.object({
    user_id: v.optional(v.string()),
    from_date: v.optional(dateStringSchema),
    to_date: v.optional(dateStringSchema),
    ...pageQuery,
  }),

  async handler({ reply, searchParams, ctx }) {
    const db = ctx.db.meddolic_user_details;
    const { page, limit, user_id, from_date, to_date } = searchParams;

    let invalidUserId = false;
    let userId = user_id;

    if (userId && (await db.count({ where: { user_id: userId } })) === 0) {
      invalidUserId = true;
      userId = undefined;
    }

    const whereCondition = {
      topup_flag: 0,
      member_id: { not: 1 },
      user_type: 2,
      ...(userId ? { user_id: userId } : {}),
    };

    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const todayStr = `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
    (whereCondition as any).date_time = buildDateRangeFilter(from_date ?? todayStr, to_date ?? todayStr);

    const [total, users] = await Promise.all([
      db.count({ where: whereCondition }),
      db.findMany({
        where: whereCondition,
        orderBy: { date_time: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          meddolic_user_details: { select: { name: true, user_id: true } },
        },
      }),
    ]);

    const rows = users.map((u, i) => ({
      index: (page - 1) * limit + i + 1,
      memberId: u.member_id,
      userId: u.user_id,
      name: u.name,
      phone: u.phone,
      sponser: `${u.meddolic_user_details?.name} (User ID:${u.meddolic_user_details?.user_id})`,
      dateTime: toDateTimeString(u.date_time),
      activationDate: u.activation_date
        ? toDateTimeString(u.activation_date)
        : "",
      topupFlag: u.topup_flag,
      accountStatus: u.account_status,
    }));

    return AppResponse.success(reply, {
      data: { invalidUserId, ...paged(rows, total, page, limit) },
    });
  },
});
