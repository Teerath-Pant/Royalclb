import { useSignals } from "@/lib/signal";
import { METHOD_META } from "@/pages/withdrawal-methods/config";
import { cn } from "@/utils/cn";

import { activeTab } from "./config";

const TABS = ["UPI", "BANK", "TRC20", "BSC"] as const;

export function Tabs() {
  useSignals();
  return (
    <div className="grid grid-cols-4 gap-2 my-3">
      {TABS.map((type) => {
        const isActive = activeTab.value === type;
        const meta = METHOD_META[type];

        return (
          <button
            key={type}
            type="button"
            onClick={() => (activeTab.value = type)}
            className={cn(
              "relative flex flex-col items-center justify-center h-22 rounded-xl transition-all duration-200 cursor-pointer border px-1 py-2 select-none",
              {
                "bg-linear-to-b from-gold-btn-start via-gold-btn-mid to-gold-btn-end border-gold-btn-border text-brand-gold-dark shadow-md scale-[1.02]":
                  isActive,
                "bg-surface-card border-border-card/60 text-text-subtle hover:border-brand-gold/40 hover:bg-surface-card-hover":
                  !isActive,
              }
            )}
          >
            <div className="flex items-center justify-center h-8 w-8 mb-1.5 shrink-0">
              <img
                src={meta.icon}
                alt={meta.label}
                className="h-7 w-7 object-contain"
              />
            </div>

            <span
              className={cn(
                "text-xs font-bold tracking-tight text-center leading-none whitespace-nowrap",
                {
                  "text-brand-gold-dark font-black": isActive,
                  "text-brand-gold-light/90": !isActive,
                }
              )}
            >
              {meta.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
