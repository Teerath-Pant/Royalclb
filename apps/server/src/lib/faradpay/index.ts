import { env } from "@/env";

import { FaradpayClient } from "./client";

export const faradpayClient = new FaradpayClient({
  baseUrl: env.FARADPAY_URL,
  apiKey: env.FARADPAY_API_KEY,
});

export const faradpayClientTrx = new FaradpayClient({
  baseUrl: env.FARADPAY_URL_TRX,
  apiKey: env.FARADPAY_API_KEY_TRX,
});
