import { createFetch, createSchema } from "@better-fetch/fetch";
import * as v from "valibot";

import { API_URL, vCoerceNumber } from "./config";

export const $userfetch = createFetch({
  baseURL: `${API_URL}/user`,
  credentials: "include",
  schema: createSchema({
    "@get/wallets": {
      output: v.object({
        success: v.boolean(),
        data: v.nullable(
          v.object({
            bonusWallet: vCoerceNumber,
            fundWallet: vCoerceNumber,
            wallet: vCoerceNumber,
            totalWallet: vCoerceNumber,
          })
        ),
      }),
    },
    "@get/wallet-details": {
      output: v.object({
        success: v.boolean(),
        data: v.nullable(
          v.object({
            bonusWallet: vCoerceNumber,
            fundWallet: vCoerceNumber,
            wallet: vCoerceNumber,
            totalWallet: vCoerceNumber,
            totalDeposit: vCoerceNumber,
            totalWithdrawal: vCoerceNumber,
          })
        ),
      }),
    },
    "@get/name/:id": {
      params: v.object({
        id: v.string(),
      }),
      output: v.object({
        success: v.boolean(),
        message: v.optional(v.string()),
        data: v.object({
          name: v.string(),
        }),
      }),
    },
    "@get/2fa": {
      output: v.object({
        success: v.boolean(),
        message: v.optional(v.string()),
        data: v.object({
          enabled: v.boolean(),
        }),
      }),
    },
    "@put/2fa": {
      input: v.object({
        enabled: v.boolean(),
      }),
      output: v.object({
        success: v.boolean(),
        message: v.string(),
        data: v.object({
          enabled: v.boolean(),
        }),
      }),
    },
  }),
});
