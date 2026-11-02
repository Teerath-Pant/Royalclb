import { createFetch, createSchema } from "@better-fetch/fetch";
import * as v from "valibot";

import {
  WITHDRAWAL_CURRENCIES,
  WITHDRAWAL_STATUSES,
  WITHDRAWAL_TYPES,
} from "@/constants/withdrawal";

import { API_URL, vCoerceNumber } from "./config";

export const withdrawalTypeSchema = v.picklist(WITHDRAWAL_TYPES);
export const withdrawalCurrencySchema = v.picklist(WITHDRAWAL_CURRENCIES);
export const withdrawalStatusSchema = v.picklist(WITHDRAWAL_STATUSES);

export const createWithdrawalInputSchema = v.object({
  amount: v.number(),
  type: withdrawalTypeSchema,
  currency: withdrawalCurrencySchema,
  otp: v.optional(v.string()),
});

export const listWithdrawalsQuerySchema = v.object({
  page: v.optional(v.number()),
  limit: v.optional(v.number()),
  status: v.optional(withdrawalStatusSchema),
});

export const withdrawalSettingsSchema = v.object({
  minWithdrawInr: v.number(),
  maxWithdrawInr: v.number(),
  minWithdrawUsd: v.number(),
  maxWithdrawUsd: v.number(),
  withdrawCharge: v.number(),
  maxWithdrawalsPerDay: v.number(),
  usdToInrRate: v.number(),
});

export const withdrawalNeedToTradeSchema = v.object({
  needToTrade: vCoerceNumber,
});

export const withdrawalItemSchema = v.object({
  id: v.number(),
  type: v.string(),
  currency: v.string(),
  originalAmount: v.optional(vCoerceNumber),
  amount: vCoerceNumber,
  charge: vCoerceNumber,
  netAmount: vCoerceNumber,
  status: withdrawalStatusSchema,
  rejectionReason: v.nullable(v.string()),
  transactionRef: v.nullable(v.string()),
  requestedAt: v.string(),
  processedAt: v.nullable(v.string()),
});

export const withdrawalListResponseDataSchema = v.object({
  totalPages: v.number(),
  currentPage: v.number(),
  total: v.number(),
  data: v.array(withdrawalItemSchema),
});

export type CreateWithdrawalInput = v.InferInput<
  typeof createWithdrawalInputSchema
>;
export type WithdrawalSettings = v.InferInput<typeof withdrawalSettingsSchema>;
export type WithdrawalItem = v.InferInput<typeof withdrawalItemSchema>;
export type WithdrawalListResponseData = v.InferInput<
  typeof withdrawalListResponseDataSchema
>;

export const $withdrawalFetch = createFetch({
  baseURL: `${API_URL}/withdrawal`,
  credentials: "include",
  throw: true,
  schema: createSchema({
    "@post/": {
      input: createWithdrawalInputSchema,
      output: v.object({
        success: v.boolean(),
        message: v.string(),
      }),
    },
    "@get/": {
      query: v.optional(listWithdrawalsQuerySchema),
      output: v.object({
        success: v.boolean(),
        message: v.optional(v.string()),
        data: withdrawalListResponseDataSchema,
      }),
    },
    "@get/settings": {
      output: v.object({
        success: v.boolean(),
        message: v.optional(v.string()),
        data: withdrawalSettingsSchema,
      }),
    },
    "@get/need-to-trade": {
      output: v.object({
        success: v.boolean(),
        message: v.optional(v.string()),
        data: withdrawalNeedToTradeSchema,
      }),
    },
    "@post/send-otp": {
      output: v.object({
        success: v.boolean(),
        message: v.string(),
      }),
    },
  }),
});
