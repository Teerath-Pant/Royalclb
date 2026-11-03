import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { createPrimaryKeySchema } from "@/utils/valibot";

export const deleteBanner = createFastifyHandler({
  method: "DELETE",
  path: "/admin/banners/:id",
  options: { auth: "admin" },
  params: v.object({ id: createPrimaryKeySchema("Invalid banner ID") }),

  async handler({ reply, params, ctx }) {
    await ctx.db.meddolic_config_banner_details.updateMany({
      where: { payment_id: params.id },
      data: { status: 0 },
    });

    return AppResponse.success(reply, { message: "Banner Deleted Successfully" });
  },
});
