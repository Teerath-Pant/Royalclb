import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const resetAviatorBucket = createFastifyHandler({
  method: "POST",
  path: "/admin/reset-bucket",
  options: { auth: "admin" },

  async handler({ reply, ctx }) {
    await ctx.db.aviatorSettings.updateMany({
      where: { id: 1 },
      data: { bucket: 0 },
    });

    return AppResponse.success(reply, { message: "Bucket Resetted Successfully!!!" });
  },
});
