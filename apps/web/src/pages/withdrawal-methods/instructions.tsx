import { AlertTriangle, Check, ShieldCheck } from "lucide-react";

export function Instructions() {
  return (
    <div className="rounded-2xl bg-surface-card border border-border-card/60 p-5 shadow-md space-y-4 my-4">
      {/* Header with badge */}
      <div className="flex items-center justify-between pb-3 border-b border-border-card/40">
        <div className="flex items-center gap-2.5 text-brand-gold">
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-brand-gold/10 border border-brand-gold/20">
            <ShieldCheck className="h-4 w-4 text-brand-gold" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-gold">
              Withdrawal Guidelines
            </h3>
            <p className="text-[11px] text-text-muted">
              Important safety rules before linking details
            </p>
          </div>
        </div>
      </div>

      {/* Structured Guidelines List */}
      <div className="space-y-3">
        {/* Rule 1 */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-input-dark/60 border border-border-card/40">
          <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-brand-gold/15 text-brand-gold text-xs font-bold shrink-0 mt-0.5">
            <Check className="h-3.5 w-3.5" />
          </div>
          <div className="text-xs space-y-0.5">
            <span className="font-bold text-white block">
              Match Legal Account Name
            </span>
            <p className="text-text-subtle leading-relaxed">
              Your bank account holder name must strictly match your registered
              full legal name.
            </p>
          </div>
        </div>

        {/* Rule 2 */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-input-dark/60 border border-border-card/40">
          <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-brand-gold/15 text-brand-gold text-xs font-bold shrink-0 mt-0.5">
            <Check className="h-3.5 w-3.5" />
          </div>
          <div className="text-xs space-y-0.5">
            <span className="font-bold text-white block">
              Verify IFSC & Account Number
            </span>
            <p className="text-text-subtle leading-relaxed">
              Double-check your 11-character IFSC code and account number to
              prevent failed or delayed transfers.
            </p>
          </div>
        </div>

        {/* Rule 3 */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-accent-salmon/10 border border-accent-salmon/25">
          <div className="flex items-center justify-center h-6 w-6 rounded-lg bg-accent-salmon/20 text-accent-salmon text-xs font-bold shrink-0 mt-0.5">
            <AlertTriangle className="h-3.5 w-3.5 text-accent-salmon" />
          </div>
          <div className="text-xs space-y-0.5">
            <span className="font-bold text-accent-salmon block">
              Correct Crypto Network Selection
            </span>
            <p className="text-text-subtle leading-relaxed">
              For <strong className="text-white">TRC20</strong> (Tron) and{" "}
              <strong className="text-white">BSC</strong> (BEP20), ensure your
              destination wallet address matches the exact network. Funds sent
              to an incompatible network cannot be recovered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
