import { BookOpen } from "lucide-react";

const INSTRUCTIONS = [
  "Minimum deposit is 10 USDT.",
  "Deposits below 10 USDT will not be accepted/credited.",
  "User must deposit the exact amount shown in the deposit order.",
  "User must select the correct USDT network before payment.",
  "If the payment order expires, user must create a new deposit order.",
  "After payment, user should wait for blockchain confirmation.",
  "If the deposit is not credited, user should contact Customer Support with Order ID and TXID.",
];

export function Instructions() {
  return (
    <div className="rounded-2xl bg-surface-card border border-border-card/60 p-4 shadow-md space-y-3 my-3">
      {/* Title */}
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-brand-gold fill-brand-gold/20" />
        <h2 className="text-base font-bold text-brand-gold">
          Recharge instructions
        </h2>
      </div>

      {/* Instructions inner box */}
      <div className="rounded-xl border border-border-card/80 bg-[#1a121c]/60 p-3.5 space-y-2.5">
        {INSTRUCTIONS.map((instruction, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-brand-gold text-xs mt-0.5 shrink-0">◆</span>
            <p className="text-xs text-text-subtle/90 leading-relaxed font-medium">
              {instruction}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
