import * as v from "valibot";

import { safeDecimal } from "@/utils/safe-decimal";

const successDataSchema = v.object({
  paymentId: v.string(),
  paymentStatus: v.string(),
  payAddress: v.string(),
  payCurrency: v.string(),
  priceAmount: v.pipe(
    v.string(),
    v.transform((val) => safeDecimal(val))
  ),
  priceCurrency: v.string(),
  network: v.string(),
  orderId: v.string(),
  orderDescription: v.string(),
  expiresAt: v.pipe(v.string(), v.isoTimestamp()),
  createdAt: v.pipe(v.string(), v.isoTimestamp()),
  updatedAt: v.pipe(v.string(), v.isoTimestamp()),
  purchaseId: v.optional(v.string()),
});

export const successResponseSchema = v.object({
  status: v.literal("success"),
  message: v.string(),
  data: successDataSchema,
});

export const errorResponseSchema = v.object({
  status: v.literal("error"),
  message: v.string(),
  errors: v.array(v.string()),
});

export const discriminatedPaymentResponseSchema = v.variant("status", [
  successResponseSchema,
  errorResponseSchema,
]);

export type FaradpayPayment = v.InferOutput<typeof successDataSchema>;
