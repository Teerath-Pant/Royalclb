import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getLink = createFastifyHandler({
  method: "GET",
  path: "/",
  options: { auth: "admin" },
  searchParams: v.object({ name: v.string() }),

  async handler({ reply, searchParams, ctx }) {
    const link = await ctx.db.links.findUnique({
      select: { link: true },
      where: { name: searchParams.name },
    });

    return AppResponse.success(reply, { data: { link: link?.link ?? "" } });
  },
});
