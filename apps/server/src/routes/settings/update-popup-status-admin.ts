import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const updatePopupStatus = createFastifyHandler({
  method: "POST",
  path: "/admin/popup/status",
  options: { auth: "admin" },
  body: v.object({ imageStatus: v.number() }),

  async handler({ reply, body, ctx }) {
    await ctx.db.meddolic_config_misc_setting.updateMany({
      data: { imageStatus: body.imageStatus },
    });

    return AppResponse.success(reply, { message: "Updated Successfully" });
  },
});
