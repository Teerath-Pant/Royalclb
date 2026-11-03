import * as v from "valibot";
import { Prisma } from "@/lib/prisma";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toDateTimeString } from "@/utils/date";
import { dayRange, todayIst } from "@/utils/day-range";
import { pageQuery, paged } from "@/utils/page-query";
import { dateStringSchema } from "@/utils/valibot";

type ListOptions = {
  path: string;
  where: Prisma.meddolic_user_detailsWhereInput;
  dateField: "date_time" | "activation_date";
};

export const memberList = ({ path, where: baseWhere, dateField }: ListOptions) =>
  createFastifyHandler({
    method: "GET",
    path,
    options: { auth: "admin" },
    searchParams: v.object({
      user_id: v.optional(v.string()),
      from_date: v.optional(dateStringSchema),
      to_date: v.optional(dateStringSchema),
      ...pageQuery,
    }),

    async handler({ reply, searchParams, ctx }) {
      const db = ctx.db.meddolic_user_details;
      const { page, limit } = searchParams;
      const noFilters = !searchParams.user_id && !searchParams.from_date && !searchParams.to_date;
      const fromDate = noFilters ? todayIst() : searchParams.from_date;
      const toDate = noFilters ? todayIst() : searchParams.to_date;

      let userId = searchParams.user_id;
      let invalidUserId = false;

      if (userId && (await db.count({ where: { user_id: userId } })) === 0) {
        invalidUserId = true;
        userId = undefined;
      }

      const range = dayRange(fromDate ?? "01-01-1970", toDate ?? "31-12-9999");

      const where: Prisma.meddolic_user_detailsWhereInput = {
        ...baseWhere,
        member_id: { not: 1 },
        user_type: 2,
        [dateField]: {
          ...(fromDate ? { gte: range.gte } : {}),
          ...(toDate ? { lte: range.lte } : {}),
        },
        ...(userId ? { user_id: userId } : {}),
      };

      const [total, users] = await Promise.all([
        db.count({ where }),
        db.findMany({
          where,
          orderBy: { [dateField]: "desc" },
          take: limit,
          skip: (page - 1) * limit,
          include: { meddolic_user_details: { select: { name: true, user_id: true } } },
        }),
      ]);

      const rows = users.map((u, i) => ({
        index: (page - 1) * limit + i + 1,
        memberId: u.member_id,
        userId: u.user_id,
        name: u.name,
        phone: u.phone,
        sponser: `${u.meddolic_user_details?.name ?? ""} (User ID:${u.meddolic_user_details?.user_id ?? ""})`,
        dateTime: toDateTimeString(u.date_time),
        activationDate: u.activation_date ? toDateTimeString(u.activation_date) : "",
        topupFlag: u.topup_flag,
        accountStatus: u.account_status,
      }));

      return AppResponse.success(reply, { data: { invalidUserId, ...paged(rows, total, page, limit) } });
    },
  });
