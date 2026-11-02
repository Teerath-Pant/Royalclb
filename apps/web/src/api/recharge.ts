import { createFetch, createSchema } from "@better-fetch/fetch";
import * as v from "valibot";

import { RECHARGE_TYPES } from "@/pages/recharge/config";

import { API_URL, vCoerceNumber } from "./config";

const rechargeInputSchema = v.object({
  id: v.number(),
  amount: v.number(),
  utrNo: v.string(),
  type: v.picklist(RECHARGE_TYPES),
});

const rechargeOnlineInputSchema = v.object({
  amount: v.number(),
  currency: v.picklist(["USDTBSC", "USDTTRX"]),
});

export const rechargeHistoryItemSchema = v.object({
  id: v.number(),
  amount: vCoerceNumber,
  utrNo: v.nullable(v.string()),
  remark: v.nullable(v.string()),
  type: v.string(),
  status: v.string(),
  createdAt: v.string(),
  respondedAt: v.nullable(v.string()),
  user: v.optional(
    v.object({
      name: v.string(),
      uid: v.number(),
    })
  ),
  metadata: v.nullable(v.string()),
});

export const rechargeHistoryResponseDataSchema = v.object({
  totalPages: v.number(),
  currentPage: v.number(),
  total: v.number(),
  data: v.array(rechargeHistoryItemSchema),
});

export type RechargeInput = v.InferInput<typeof rechargeInputSchema>;
export type RechargeOnlineInput = v.InferInput<
  typeof rechargeOnlineInputSchema
>;
export type RechargeHistoryItem = v.InferInput<
  typeof rechargeHistoryItemSchema
>;
export type RechargeHistoryResponseData = v.InferInput<
  typeof rechargeHistoryResponseDataSchema
>;

export const $rechargefetch = createFetch({
  baseURL: `${API_URL}/fund`,
  credentials: "include",
  throw: true,
  schema: createSchema({
    "@post/recharge": {
      input: rechargeInputSchema,
      output: v.object({
        success: v.boolean(),
        message: v.string(),
      }),
    },
    "@post/recharge-online": {
      input: rechargeOnlineInputSchema,
      output: v.object({
        success: v.boolean(),
        message: v.string(),
        data: v.object({
          id: v.number(),
          amount: v.number(),
          paymentId: v.nullable(v.string()),
          payAddress: v.nullable(v.string()),
          orderId: v.nullable(v.string()),
        }),
      }),
    },
    "@get/recharge": {
      query: v.optional(
        v.object({
          page: v.optional(v.number()),
          limit: v.optional(v.number()),
        })
      ),
      output: v.object({
        success: v.boolean(),
        code: v.optional(v.string()),
        message: v.optional(v.string()),
        timestamp: v.optional(v.string()),
        data: rechargeHistoryResponseDataSchema,
      }),
    },
  }),
});
