import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { saveSupportImage } from "@/utils/save-image";

export const addBanner = createFastifyHandler({
  method: "POST",
  path: "/admin/banners",
  options: { auth: "admin" },
  body: v.object({ fileName: v.string(), image: v.string() }),

  async handler({ reply, body, ctx }) {
    const newFileName = await saveSupportImage({
      ...body,
      prefix: "QRImage-",
      allowedExtensions: ["gif", "jpeg", "jpg", "png", "webp"],
      errorMessage: "Invalid image format or size too large",
    });

    await ctx.db.meddolic_config_banner_details.create({
      data: { paymentName: "1", paymentAddress: "1", paymentImage: `assets/SupportFile/${newFileName}` },
    });

    return AppResponse.success(reply, { message: "Banner Added Successfully" });
  },
});
