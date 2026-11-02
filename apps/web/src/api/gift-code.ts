import { createFetch, createSchema } from "@better-fetch/fetch";
import * as v from "valibot";

import { API_URL, vCoerceNumber } from "./config";

export const $giftCodeFetch = createFetch({
  baseURL: `${API_URL}/gift-codes`,
  credentials: "include",
  throw: true,
  schema: createSchema({
    "@post/claim": {
      input: v.object({
        code: v.string(),
      }),
      output: v.object({
        success: v.boolean(),
        message: v.string(),
        data: v.nullable(
          v.object({
            amount: vCoerceNumber,
          })
        ),
      }),
    },
    "@get/claim-history": {
      output: v.object({
        success: v.boolean(),
        message: v.string(),
        data: v.object({
          total: v.number(),
          totalPages: v.number(),
          currentPage: v.number(),
          items: v.array(
            v.object({
              id: v.number(),
              claimedAt: v.string(),
              giftCode: v.object({
                code: v.string(),
                amount: vCoerceNumber,
              }),
            })
          ),
        }),
      }),
    },
  }),
});
