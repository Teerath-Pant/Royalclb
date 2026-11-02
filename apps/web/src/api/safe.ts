import { createFetch, createSchema } from "@better-fetch/fetch";
import * as v from "valibot";

import { API_URL, vCoerceNumber } from "./config";

export const $safeFetch = createFetch({
  baseURL: `${API_URL}/safe`,
  throw: true,
  credentials: "include",
  schema: createSchema({
    "@post/deposit": {
      input: v.object({
        amount: v.number(),
      }),
      output: v.object({
        success: v.boolean(),
        message: v.string(),
      }),
    },
    "@post/withdrawal": {
      input: v.object({
        amount: v.number(),
      }),
      output: v.object({
        success: v.boolean(),
        message: v.string(),
      }),
    },
    "@get/balance": {
      output: v.object({
        success: v.boolean(),
        data: v.nullable(
          v.object({
            safeWallet: vCoerceNumber,
            safeInterestWallet: vCoerceNumber,
          })
        ),
      }),
    },
    "@get/settings": {
      output: v.object({
        success: v.boolean(),
        data: v.nullable(
          v.object({
            interestRate: vCoerceNumber,
            minDepositAmount: vCoerceNumber,
            maxDepositAmount: vCoerceNumber,
            minWithdrawAmount: vCoerceNumber,
            maxWithdrawAmount: vCoerceNumber,
          })
        ),
      }),
    },
    "@get/transactions": {
      output: v.object({
        success: v.boolean(),
        data: v.nullable(
          v.object({
            items: v.array(
              v.object({
                id: v.number(),
                userId: v.number(),
                type: v.string(),
                amount: vCoerceNumber,
                balanceAfter: vCoerceNumber,
                createdAt: v.string(),
              })
            ),
            total: v.number(),
            page: v.number(),
            limit: v.number(),
          })
        ),
      }),
    },
    "@get/interest-logs": {
      output: v.object({
        success: v.boolean(),
        data: v.nullable(
          v.object({
            items: v.array(
              v.object({
                id: v.number(),
                userId: v.number(),
                amount: vCoerceNumber,
                date: v.string(),
                createdAt: v.string(),
              })
            ),
            total: v.number(),
            page: v.number(),
            limit: v.number(),
          })
        ),
      }),
    },
    "@get/accumulated-revenue": {
      output: v.object({
        success: v.boolean(),
        data: v.nullable(vCoerceNumber),
      }),
    },
  }),
});
