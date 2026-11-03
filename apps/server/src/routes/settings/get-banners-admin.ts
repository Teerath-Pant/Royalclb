import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getBanners = createFastifyHandler({
  method: "GET",
  path: "/admin/banners",
  options: { auth: "admin" },

  async handler({ reply, ctx }) {
    const banners = await ctx.db.meddolic_config_banner_details.findMany({
      where: { status: 1 },
      orderBy: { payment_id: "asc" },
      select: { payment_id: true, paymentImage: true },
    });

    return AppResponse.success(reply, {
      data: banners.map((b) => ({ id: b.payment_id, image: b.paymentImage })),
    });
  },
});
