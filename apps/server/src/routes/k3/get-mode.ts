import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getMode = createFastifyHandler({
  method: "GET",
  path: "/settings/mode",
  options: { auth: "admin" },
  searchParams: v.object({
    interval: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ searchParams, reply, ctx }) {
    const settings = await ctx.db.meddolic_config_k3_settings.findUnique({
      select: { mode: true },
      where: { interval_min: searchParams.interval },
    });

    return AppResponse.success(reply, { data: { mode: settings?.mode ?? null } });
  },
});
