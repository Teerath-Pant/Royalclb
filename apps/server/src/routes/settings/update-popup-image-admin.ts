import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { saveSupportImage } from "@/utils/save-image";

export const updatePopupImage = createFastifyHandler({
  method: "POST",
  path: "/admin/popup/image",
  options: { auth: "admin" },
  body: v.object({ fileName: v.string(), image: v.string() }),

  async handler({ reply, body, ctx }) {
    const newFileName = await saveSupportImage({
      ...body,
      prefix: "NoticeImage-",
      allowedExtensions: ["gif", "jpeg", "jpg", "png"],
      errorMessage: "Please Select Correct Format????",
    });

    await ctx.db.meddolic_config_misc_setting.updateMany({
      data: { dashboardImage: `assets/SupportFile/${newFileName}`, imageStatus: 1 },
    });

    return AppResponse.success(reply, { message: "Image Updated!!!!" });
  },
});
