import { Info } from "lucide-react";

import { Balance } from "./balance";
import { openModal } from "./config";
import { History } from "./history";
import { InterestRateBadge } from "./interest-rate-badge";
import { Stats } from "./stats";

const ROI_REWARD_RULES = [
  {
    title: "Daily ROI",
    body: "A $1,000 investment earns 1% Daily ROI = $10 per day, until the total amount reaches $2,000.",
  },
  {
    title: "Investment Lock",
    body: "Your investment and earned ROI will remain locked until the $2,000 target is reached.",
  },
  {
    title: "Betting Requirement",
    body: "To make each $10 Daily ROI withdrawable, you must complete a minimum of $20 in betting turnover.",
  },
  {
    title: "If Betting Is Not Completed",
    body: "If the required betting turnover is not completed on a particular day, that day's ROI will remain in your Pending Rewards balance. It will not expire.",
  },
  {
    title: "Pending Rewards",
    body: "You can complete the required betting turnover later to convert your eligible pending rewards into Withdrawable Balance.",
  },
];

function RoiRewardRules() {
  return (
    <div className="pt-3">
      <h3 className="text-center text-xs font-bold text-brand-gold mb-2">
        ROI Reward Rules
      </h3>
      <ol className="space-y-2">
        {ROI_REWARD_RULES.map((rule, index) => (
          <li key={rule.title} className="flex items-start gap-2">
            <span className="shrink-0 mt-0.5 h-4 w-4 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold flex items-center justify-center">
              {index + 1}
            </span>
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-white">{rule.title}: </span>
              <span className="text-text-subtle">{rule.body}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function MainView() {
  return (
    <div className="bg-bg-page text-white font-sans px-4 pb-8 space-y-4">
      {/* Interest Rate Badge */}
      <InterestRateBadge />

      {/* Emerald Balance Card */}
      <Balance />

      {/* Stats & Actions Card */}
      <div className="rounded-2xl bg-surface-card p-4 shadow-md border border-border-card/60">
        <Stats />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <button
            type="button"
            onClick={() => openModal("transfer-out")}
            className="w-full rounded-xl border border-brand-gold bg-transparent py-2.5 text-sm font-bold text-brand-gold transition-colors hover:bg-brand-gold/10 cursor-pointer"
          >
            Transfer Out
          </button>
          <button
            type="button"
            onClick={() => openModal("transfer-in")}
            className="w-full rounded-xl bg-brand-gold py-2.5 text-sm font-bold text-gray-950 transition-colors hover:bg-brand-gold-hover shadow-md cursor-pointer"
          >
            Transfer In
          </button>
        </div>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-accent-salmon font-medium my-3">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>
            Funds are safe and secure, and can be transferred at any time
          </span>
        </div>

        {/* ROI Reward Rules */}
        <RoiRewardRules />
      </div>

      {/* Historical Records Section */}
      <History />
    </div>
  );
}
