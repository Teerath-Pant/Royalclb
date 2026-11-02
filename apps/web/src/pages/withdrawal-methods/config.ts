import { signal } from "@/lib/signal";

import type { WithdrawalType } from "@/constants/withdrawal";

export interface MethodMeta {
  label: string;
  subtitle: string;
  icon: string;
}

export const METHOD_META: Record<WithdrawalType, MethodMeta> = {
  UPI: {
    label: "UPI",
    subtitle: "Instant INR",
    icon: "/assets/images/upi.svg",
  },
  BANK: {
    label: "Bank",
    subtitle: "Bank Transfer",
    icon: "/assets/images/bank.svg",
  },
  TRC20: {
    label: "TRC20",
    subtitle: "Tron Network",
    icon: "/assets/images/usdttrc20.svg",
  },
  BSC: {
    label: "BEP20",
    subtitle: "BSC Network",
    icon: "/assets/images/usdtbsc.svg",
  },
};

export const activeTab = signal<WithdrawalType>("UPI");
