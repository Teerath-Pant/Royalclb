import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toDateTimeString } from "@/utils/date";

export const searchMembers = createFastifyHandler({
  method: "GET",
  path: "/admin/members/search",
  options: { auth: "admin" },
  searchParams: v.object({ search_value: v.optional(v.string()) }),

  async handler({ reply, searchParams, ctx }) {
    const search = searchParams.search_value;

    if (!search) {
      return AppResponse.success(reply, { data: [] });
    }

    const rows = await ctx.db.meddolic_user_details.findMany({
      where: {
        user_type: 2,
        OR: [
          { user_id: { contains: search } },
          { name: { contains: search } },
          { phone: { contains: search } },
          ...(/^\d+$/.test(search) ? [{ uid: Number(search) }] : []),
        ],
      },
      orderBy: { member_id: "asc" },
      include: { meddolic_user_details: { select: { name: true, user_id: true } } },
    });

    const members = rows.map((m) => {
      const joined = toDateTimeString(m.date_time);
      const day = joined.slice(8, 10);

      return {
        memberId: m.member_id,
        userId: m.user_id,
        name: m.name,
        phone: m.phone,
        sponserUserId: m.meddolic_user_details?.user_id ?? "",
        sponserName: m.meddolic_user_details?.name ?? "",
        dateOfJoining: `${day}-${joined.slice(5, 7)}-${joined.slice(0, 4)} ${joined.slice(11, 16)}:${day}`,
        password: m.password,
      };
    });

    return AppResponse.success(reply, { data: members });
  },
});
