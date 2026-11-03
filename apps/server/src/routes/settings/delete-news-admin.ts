import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { createPrimaryKeySchema } from "@/utils/valibot";

export const deleteNews = createFastifyHandler({
  method: "DELETE",
  path: "/admin/news/:id",
  options: { auth: "admin" },
  params: v.object({ id: createPrimaryKeySchema("Invalid news ID") }),

  async handler({ reply, params, ctx }) {
    await ctx.db.meddolic_config_news_list.updateMany({
      where: { newsId: params.id },
      data: { newStatus: 0 },
    });

    return AppResponse.success(reply, { message: "News Deleted Successfully" });
  },
});
