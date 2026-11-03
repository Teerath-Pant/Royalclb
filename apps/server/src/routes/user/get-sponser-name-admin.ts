import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getSponserName = createFastifyHandler({
  method: "GET",
  path: "/admin/sponser-name",
  options: { auth: "admin" },
  searchParams: v.object({ sponser_id: v.string() }),

  async handler({ reply, searchParams, ctx }) {
    const user = await ctx.db.meddolic_user_details.findFirst({
      select: { name: true },
      where: { user_id: searchParams.sponser_id, account_status: 1 },
    });

    return AppResponse.success(reply, { data: { name: user?.name ?? "" } });
  },
});
