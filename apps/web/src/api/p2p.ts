import { createFetch, createSchema } from "@better-fetch/fetch";
import * as v from "valibot";

import { API_URL, vCoerceNumber } from "./config";

export const transferItemSchema = v.object({
  uid: v.number(),
  amount: vCoerceNumber,
  charge: vCoerceNumber,
  netAmount: vCoerceNumber,
  dateTime: v.string(),
  sender: v.object({
    uid: v.number(),
    name: v.string(),
  }),
  receiver: v.object({
    uid: v.number(),
    name: v.string(),
  }),
});

export const transferHistoryResponseSchema = v.object({
  totalPages: v.number(),
  currentPage: v.number(),
  total: v.number(),
  data: v.array(transferItemSchema),
});

export type TransferItem = v.InferOutput<typeof transferItemSchema>;
export type TransferHistoryResponse = v.InferOutput<
  typeof transferHistoryResponseSchema
>;

export const $p2pFetch = createFetch({
  baseURL: `${API_URL}/fund`,
  credentials: "include",
  schema: createSchema({
    "@post/transfer": {
      input: v.object({
        id: v.number(),
        amount: v.number(),
      }),
      output: v.object({
        success: v.boolean(),
        message: v.string(),
      }),
    },
    "@get/transfer": {
      query: v.object({
        page: v.number(),
        limit: v.optional(v.number()),
      }),
      output: v.object({
        success: v.boolean(),
        message: v.optional(v.string()),
        data: transferHistoryResponseSchema,
      }),
    },
  }),
});
