import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import { Link } from "@/components/link";

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 my-4">
      <Link
        href="/recharge"
        className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-card hover:bg-surface-card-hover border border-border-card transition-colors group no-underline"
      >
        <div className="w-10 h-10 rounded-full bg-brand-gold-dark flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
          <ArrowDownCircle className="text-brand-gold w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-brand-gold-light">
          Deposit
        </span>
      </Link>

      <Link
        href="/withdrawal"
        className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-card hover:bg-surface-card-hover border border-border-card transition-colors group no-underline"
      >
        <div className="w-10 h-10 rounded-full bg-surface-card-header flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
          <ArrowUpCircle className="text-accent-teal w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-brand-gold-light">
          Withdraw
        </span>
      </Link>
    </div>
  );
}
