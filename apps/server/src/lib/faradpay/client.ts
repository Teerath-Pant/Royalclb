import { create } from "axios";
import type { AxiosInstance } from "axios";
import type Decimal from "decimal.js";
import * as v from "valibot";

import { AppError } from "@/utils/app-error";

import { discriminatedPaymentResponseSchema } from "./schema";
import type { FaradpayPayment } from "./schema";

export type FaradpayClientOptions = {
  baseUrl: string;
  apiKey: string;
};

export type CreatePaymentInput = {
  amount: Decimal;
  currencySymbol: "USDTBSC" | "USDTTRX";
  orderId: string;
  orderDescription: string;
  ipnCallbackUrl?: string;
};

export class FaradpayClient {
  private http: AxiosInstance;
  private apiKey: string;

  constructor(options: FaradpayClientOptions) {
    this.http = create({ baseURL: options.baseUrl });
    this.apiKey = options.apiKey;
  }

  async createPayment(input: CreatePaymentInput): Promise<FaradpayPayment> {
    const { data } = await this.http.post(
      "/payment",
      {
        priceAmount: input.amount.toNumber(),
        priceCurrency: input.currencySymbol,
        payCurrency: input.currencySymbol,
        orderId: input.orderId,
        orderDescription: input.orderDescription,
        ipnCallbackUrl: input.ipnCallbackUrl,
      },
      {
        headers: { "x-api-key": this.apiKey },
        validateStatus: () => true,
      }
    );

    const parsed = v.parse(discriminatedPaymentResponseSchema, data);

    if (parsed.status === "error") {
      throw AppError.badRequest({ message: parsed.message });
    }

    return parsed.data;
  }
}
