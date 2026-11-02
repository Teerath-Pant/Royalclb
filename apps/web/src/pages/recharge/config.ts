import { signal, computed } from "@/lib/signal";

export const TABS = ["UPI", "TRC 20", "BEP 20 online"] as const;
export type Tab = (typeof TABS)[number];

export const RECHARGE_TYPES = ["INR", "USDT"] as const;
export type RechargeType = (typeof RECHARGE_TYPES)[number];

export const PRESET_AMOUNTS_INR = [
  1000, 2000, 5000, 20_000, 40_000, 50_000,
] as const;
export const PRESET_AMOUNTS_USDT = [
  10, 30, 60, 100, 500, 1000, 5000, 7000, 10_000,
] as const;
export const activeTab = signal<Tab>("UPI");
export const activeBonusRate = signal<3 | 8>(3);

export function selectBonusRate(rate: 3 | 8) {
  activeBonusRate.value = rate;
}

export const activeRechargeType = computed<RechargeType>(() => {
  if (activeTab.value === "UPI") {
    return "INR";
  }
  return "USDT";
});
