import * as v from "valibot";

import { withdrawalMethods_type } from "@/lib/prisma";
import { AppError } from "@/utils/app-error";

export const withdrawalTypeSchema = v.enum(withdrawalMethods_type);
export type WithdrawalType = v.InferOutput<typeof withdrawalTypeSchema>;

const upiDetailsSchema = v.object({
  upiId: v.pipe(v.string(), v.regex(/^[\w.-]+@[\w]+$/u, "Invalid UPI ID")),
});

const bankDetailsSchema = v.object({
  accountNumber: v.pipe(v.string(), v.minLength(6), v.maxLength(20)),
  ifsc: v.pipe(v.string(), v.regex(/^[A-Z]{4}0[A-Z0-9]{6}$/u, "Invalid IFSC")),
  accountHolderName: v.pipe(v.string(), v.minLength(1)),
  bankName: v.pipe(v.string(), v.minLength(1)),
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
export type WithdrawalMethod = v.InferOutput<typeof withdrawalMethodSchema>;

const detailsSchemaMap = {
  UPI: upiDetailsSchema,
  BANK: bankDetailsSchema,
  TRC20: trc20DetailsSchema,
  BSC: bscDetailsSchema,
} as const;

export function validateWithdrawalDetails(
  type: WithdrawalType,
  details: unknown
) {
  const result = v.safeParse(detailsSchemaMap[type], details);

  if (!result.success) {
    throw AppError.badRequest({
      message: `Invalid details for ${type}: ${result.issues[0]?.message ?? "validation failed"}`,
    });
  }

  return result.output;
}

export function parseWithdrawalMethod(row: {
  type: string;
  details: string;
}): WithdrawalMethod {
  let parsedDetails: unknown;

  try {
    parsedDetails = JSON.parse(row.details);
  } catch {
    throw AppError.internal({ message: "Corrupted withdrawal method details" });
  }

  const result = v.safeParse(withdrawalMethodSchema, {
    type: row.type,
    details: parsedDetails,
  });

  if (!result.success) {
    throw AppError.internal({ message: "Withdrawal method failed validation" });
  }

  return result.output;
}
