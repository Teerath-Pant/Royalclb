import { createFetch, createSchema } from "@better-fetch/fetch";
import * as v from "valibot";

import { API_URL } from "./config";

export const $settingsfetch = createFetch({
  baseURL: `${API_URL}/settings`,
  credentials: "include",
  schema: createSchema({
    "@get/": {
      output: v.object({
        success: v.boolean(),
        data: v.nullable(
          v.object({
            minRechargeInr: v.number(),
            minRechargeUsdt: v.number(),
            usdPrice: v.number(),
          })
        ),
      }),
    },
  }),
});
