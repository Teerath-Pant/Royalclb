import * as v from "valibot";

import { k3SettingsService } from "@/services/k3-settings.service";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const updateMode = createFastifyHandler({
  method: "PUT",
  path: "/settings/mode",
  options: { auth: "admin" },
  body: v.object({
    interval: v.pipe(v.unknown(), v.toNumber()),
    mode: v.string(),
  }),

  async handler({ body, reply }) {
    const { interval, mode } = body;

    await k3SettingsService.set({ mode }, interval);

    return AppResponse.success(reply, {
      message: "Game Mode Updated Successfully",
    });
  },
});
