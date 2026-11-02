import {
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  Trophy,
  Wallet,
} from "lucide-react";

import type { WalletDetails } from "@/queries/wallet-details";
import { formatAmount } from "@/utils/format-amount";

type WalletBreakdownProps = {
  details: WalletDetails | undefined;
  isPending: boolean;
};

export function WalletBreakdown({ details, isPending }: WalletBreakdownProps) {
  const items = [
    {
      title: "Winning Wallet",
      amount: details?.wallet ?? 0,
      icon: Trophy,
      color: "text-brand-gold",
      bgColor: "bg-brand-gold-dark",
    },
    {
      title: "Recharge Wallet",
      amount: details?.fundWallet ?? 0,
      icon: Wallet,
      color: "text-accent-teal",
      bgColor: "bg-surface-card-header",
    },
    {
      title: "Bonus Wallet",
      amount: details?.bonusWallet ?? 0,
      icon: Gift,
      color: "text-brand-gold-light",
      bgColor: "bg-surface-card-header",
    },
    {
      title: "Total Deposit",
      amount: details?.totalDeposit ?? 0,
      icon: ArrowDownLeft,
      color: "text-accent-teal",
      bgColor: "bg-surface-card-header",
    },
    {
      title: "Total Withdrawal",
      amount: details?.totalWithdrawal ?? 0,
      icon: ArrowUpRight,
      color: "text-accent-salmon",
      bgColor: "bg-surface-card-header",
    },
  ];

  return (
    <div className="space-y-3 my-4">
      <h3 className="text-sm font-semibold text-brand-gold-light px-1">
        Wallet Summary
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-center justify-between p-3.5 rounded-xl bg-surface-card border border-border-card"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg ${item.bgColor} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-xs font-medium text-text-subtle">
                    {item.title}
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {isPending ? "Loading…" : formatAmount(item.amount)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
