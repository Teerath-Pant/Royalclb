import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toDateTimeString } from "@/utils/date";

export const getMemberDetails = createFastifyHandler({
  method: "GET",
  path: "/admin/members/details",
  options: { auth: "admin" },
  searchParams: v.object({ user_id: v.string() }),

  async handler({ reply, searchParams, ctx }) {
    const m = await ctx.db.meddolic_user_details.findFirst({
      where: { user_id: searchParams.user_id },
      include: { meddolic_user_details: { select: { name: true, user_id: true } } },
    });

    if (!m) {
      return AppResponse.success(reply, { data: null });
    }

    const joined = toDateTimeString(m.date_time);
    const day = joined.slice(8, 10);

    return AppResponse.success(reply, {
      data: {
        memberId: m.member_id,
        userId: m.user_id,
        name: m.name,
        phone: m.phone,
        emailId: m.email_id,
        sponser: `${m.meddolic_user_details?.name ?? ""} (${m.meddolic_user_details?.user_id ?? ""})`,
        dateOfJoining: `${day}-${joined.slice(5, 7)}-${joined.slice(0, 4)} ${joined.slice(11, 16)}:${day}`,
        password: m.password,
      },
    });
  },
});
