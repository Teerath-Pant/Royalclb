import { computed, signal } from "@/lib/signal";

import type {
  WithdrawalCurrency,
  WithdrawalType,
} from "@/constants/withdrawal";

export const activeTab = signal<WithdrawalType>("UPI");

export const activeCurrency = computed<WithdrawalCurrency>(() => {
  if (activeTab.value === "UPI" || activeTab.value === "BANK") {
    return "INR";
  }
  return "USD";
});

export const PRESET_AMOUNTS_INR = [
  500, 1000, 2000, 5000, 10_000, 20_000,
] as const;
export const PRESET_AMOUNTS_USDT = [10, 30, 60, 100, 500, 1000] as const;
