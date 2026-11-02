import { useSignals } from "@/lib/signal";
import { activeBonusRate, activeTab, selectBonusRate } from "./config";

function getChannelImage() {
  if (activeTab.value === "TRC 20") {
    return "/assets/images/usdttrc20.svg";
  }
  return "/assets/images/usdtbsc.svg";
}

export function ChannelRates() {
  useSignals();
  return (
    <section className="rounded-xl border border-border-card/60 bg-surface-card-header p-3 space-y-2">
      <h2 className="text-sm font-bold text-brand-gold">Select channel</h2>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => selectBonusRate(3)}
          className={
            activeBonusRate.value === 3
              ? "rounded-lg border border-brand-gold bg-linear-to-br from-brand-gold/20 to-brand-gold/5 px-3 py-3 text-center cursor-pointer space-y-2"
              : "rounded-lg border border-border-card/60 bg-surface-card px-3 py-3 text-center cursor-pointer space-y-2 hover:bg-surface-card/80 transition-colors"
          }
        >
          <div className="flex items-center justify-center">
            <img src={getChannelImage()} alt="Channel" className="h-8 w-auto" />
          </div>
          <div className="text-xs text-brand-gold-light/90">
            Balance: $10 - $6999
          </div>
          <div className="text-sm font-bold text-brand-gold">3% bonus</div>
        </button>
        <button
          type="button"
          onClick={() => selectBonusRate(8)}
          className={
            activeBonusRate.value === 8
              ? "rounded-lg border border-brand-gold bg-linear-to-br from-brand-gold/20 to-brand-gold/5 px-3 py-3 text-center cursor-pointer space-y-2"
              : "rounded-lg border border-border-card/60 bg-surface-card px-3 py-3 text-center cursor-pointer space-y-2 hover:bg-surface-card/80 transition-colors"
          }
        >
          <div className="flex items-center justify-center">
            <img src={getChannelImage()} alt="Channel" className="h-8 w-auto" />
          </div>
          <div className="text-xs text-brand-gold-light/90">
            Balance : $7000 - above
          </div>
          <div className="text-sm font-bold text-brand-gold">8% bonus</div>
        </button>
      </div>
    </section>
  );
}
