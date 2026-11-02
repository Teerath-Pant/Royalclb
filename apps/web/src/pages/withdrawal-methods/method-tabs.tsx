import { useSignals } from "@/lib/signal";
import { CheckCircle2 } from "lucide-react";

import type { WithdrawalMethod } from "@/api/withdrawal-methods";
import { WITHDRAWAL_TYPES } from "@/constants/withdrawal";
import { cn } from "@/utils/cn";

import { activeTab, METHOD_META } from "./config";

interface MethodTabsProps {
  configuredMethods?: WithdrawalMethod[];
}

export function MethodTabs({ configuredMethods = [] }: MethodTabsProps) {
  useSignals();
  const configuredTypes = new Set(configuredMethods.map((m) => m.type));

  return (
    <div className="grid grid-cols-4 gap-2 my-3">
      {WITHDRAWAL_TYPES.map((type) => {
        const isActive = activeTab.value === type;
        const isConfigured = configuredTypes.has(type);
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
            {isConfigured && (
              <span className="absolute top-1 right-1 flex items-center justify-center">
                <CheckCircle2
                  className={cn("h-3.5 w-3.5", {
                    "text-brand-gold-dark fill-brand-gold-dark/20": isActive,
                    "text-accent-teal fill-accent-teal/20": !isActive,
                  })}
                />
              </span>
            )}

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
