import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toDateTimeString } from "@/utils/date";

export const getNews = createFastifyHandler({
  method: "GET",
  path: "/admin/news",
  options: { auth: "admin" },

  async handler({ reply, ctx }) {
    const news = await ctx.db.meddolic_config_news_list.findMany({
      where: { newStatus: 1 },
      orderBy: { addDate: "desc" },
    });

    return AppResponse.success(reply, {
      data: news.map((n) => ({ id: n.newsId, news: n.news, addDate: toDateTimeString(n.addDate) })),
    });
  },
});
