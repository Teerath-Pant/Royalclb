import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

const DUBAI_OFFSET_MS = 4 * 60 * 60 * 1000;

export const addNews = createFastifyHandler({
  method: "POST",
  path: "/admin/news",
  options: { auth: "admin" },
  body: v.object({ news: v.string() }),

  async handler({ reply, body, ctx }) {
    await ctx.db.meddolic_config_news_list.create({
      data: {
        news: body.news,
        addDate: new Date(Date.now() + DUBAI_OFFSET_MS),
        newStatus: 1,
      },
    });

    return AppResponse.success(reply, { message: "News Added Successfully!!!" });
  },
});
