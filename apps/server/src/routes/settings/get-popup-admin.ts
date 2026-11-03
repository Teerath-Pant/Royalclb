import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getPopup = createFastifyHandler({
  method: "GET",
  path: "/admin/popup",
  options: { auth: "admin" },

  async handler({ reply, ctx }) {
    const config = await ctx.db.meddolic_config_misc_setting.findFirst({
      select: { dashboardImage: true, imageStatus: true },
    });

    return AppResponse.success(reply, {
      data: {
        dashboardImage: config?.dashboardImage ?? null,
        imageStatus: config?.imageStatus ?? null,
      },
    });
  },
});
