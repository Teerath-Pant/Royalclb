import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const setMemberStatus = createFastifyHandler({
  method: "POST",
  path: "/admin/members/status",
  options: { auth: "admin" },
  body: v.object({ memberId: v.number(), blockStatus: v.number() }),

  async handler({ reply, body, ctx }) {
    await ctx.db.meddolic_user_details.updateMany({
      where: { member_id: body.memberId },
      data: { account_status: body.blockStatus },
    });

    return AppResponse.success(reply, {
      message: body.blockStatus === 0 ? "User Block Successfully" : "User Un-Block Successfully",
    });
  },
});
