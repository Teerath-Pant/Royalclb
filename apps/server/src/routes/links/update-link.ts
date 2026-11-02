import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const updateLink = createFastifyHandler({
  method: "PUT",
  path: "/",
  options: { auth: "admin" },
  body: v.object({
    name: v.string(),
    link: v.pipe(v.string(), v.url()),
  }),

  async handler({ body, reply, ctx }) {
    const { name, link } = body;

    const newLink = await ctx.db.links.upsert({
      create: {
        name,
        link,
      },
      update: {
        link,
      },
      where: {
        name,
      },
    });

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "Link updated successfully",
      data: newLink,
    });
  },
});
