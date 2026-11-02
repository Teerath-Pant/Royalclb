import { createFetch, createSchema } from "@better-fetch/fetch";
import * as v from "valibot";

import { WITHDRAWAL_TYPES } from "@/constants/withdrawal";

import { API_URL } from "./config";

const withdrawalTypeSchema = v.picklist(WITHDRAWAL_TYPES);

const upiDetailsSchema = v.object({
  upiId: v.pipe(v.string(), v.regex(/^[\w.-]+@[\w]+$/u, "Invalid UPI ID")),
});

const bankDetailsSchema = v.object({
  accountNumber: v.pipe(
    v.string(),
    v.minLength(6, "Account number must be at least 6 characters"),
    v.maxLength(20, "Account number must be at most 20 characters")
  ),
  ifsc: v.pipe(v.string(), v.regex(/^[A-Z]{4}0[A-Z0-9]{6}$/u, "Invalid IFSC")),
  accountHolderName: v.pipe(
    v.string(),
    v.minLength(1, "Account holder name is required")
  ),
  bankName: v.pipe(v.string(), v.minLength(1, "Bank name is required")),
});

const trc20DetailsSchema = v.object({
  walletAddress: v.pipe(
    v.string(),
    v.regex(/^T[a-zA-Z0-9]{33}$/u, "Invalid TRC20 address")
  ),
});

const bscDetailsSchema = v.object({
  walletAddress: v.pipe(
    v.string(),
    v.regex(/^0x[a-fA-F0-9]{40}$/u, "Invalid BSC address")
  ),
});

export const withdrawalMethodSchema = v.variant("type", [
  v.object({ type: v.literal("UPI"), details: upiDetailsSchema }),
  v.object({ type: v.literal("BANK"), details: bankDetailsSchema }),
  v.object({ type: v.literal("TRC20"), details: trc20DetailsSchema }),
  v.object({ type: v.literal("BSC"), details: bscDetailsSchema }),
]);

const withdrawalMethodWithTimestampsSchema = v.intersect([
  withdrawalMethodSchema,
  v.object({
    createdAt: v.string(),
    updatedAt: v.string(),
  }),
]);

const upsertUpiInputSchema = v.object({ details: upiDetailsSchema });
const upsertBankInputSchema = v.object({ details: bankDetailsSchema });
const upsertTrc20InputSchema = v.object({ details: trc20DetailsSchema });
const upsertBscInputSchema = v.object({ details: bscDetailsSchema });

export type WithdrawalType = v.InferInput<typeof withdrawalTypeSchema>;
export type WithdrawalMethod = v.InferInput<
  typeof withdrawalMethodWithTimestampsSchema
>;
export type UpiDetails = v.InferInput<typeof upiDetailsSchema>;
export type BankDetails = v.InferInput<typeof bankDetailsSchema>;
export type Trc20Details = v.InferInput<typeof trc20DetailsSchema>;
export type BscDetails = v.InferInput<typeof bscDetailsSchema>;

export const $withdrawalMethodFetch = createFetch({
  baseURL: `${API_URL}/withdrawal-methods`,
  credentials: "include",
  throw: true,
  schema: createSchema({
    "@get/": {
      output: v.object({
        success: v.boolean(),
        message: v.optional(v.string()),
        data: v.array(withdrawalMethodWithTimestampsSchema),
      }),
    },
    "@get/:type": {
      params: v.object({ type: withdrawalTypeSchema }),
      output: v.object({
        success: v.boolean(),
        message: v.optional(v.string()),
        data: withdrawalMethodWithTimestampsSchema,
      }),
    },
    "@put/UPI": {
      input: upsertUpiInputSchema,
      output: v.object({
        success: v.boolean(),
        message: v.string(),
        data: withdrawalMethodSchema,
      }),
    },
    "@put/BANK": {
      input: upsertBankInputSchema,
      output: v.object({
        success: v.boolean(),
        message: v.string(),
        data: withdrawalMethodSchema,
      }),
    },
    "@put/TRC20": {
      input: upsertTrc20InputSchema,
      output: v.object({
        success: v.boolean(),
        message: v.string(),
        data: withdrawalMethodSchema,
      }),
    },
    "@put/BSC": {
      input: upsertBscInputSchema,
      output: v.object({
        success: v.boolean(),
        message: v.string(),
        data: withdrawalMethodSchema,
      }),
    },
  }),
});
