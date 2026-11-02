import { useSignals } from "@/lib/signal";
import { useMutation } from "@tanstack/react-query";
import { Wallet, XCircle } from "lucide-react";
import { useState } from "react";

import type { RechargeOnlineInput } from "@/api/recharge";
import { $rechargefetch } from "@/api/recharge";
import { notyf } from "@/lib/notyf";
import { cn } from "@/utils/cn";
import { navigate } from "@/utils/navigation";

import { ChannelRates } from "./channel-rates";
import { activeTab, PRESET_AMOUNTS_USDT } from "./config";

export function OnlineTab() {
  useSignals();
  const [rechargeAmount, setRechargeAmount] = useState<number>(
    PRESET_AMOUNTS_USDT[0]
  );

  const { mutate, isPending } = useMutation({
    mutationKey: ["recharges", "online"],
    mutationFn: async (input: RechargeOnlineInput) =>
      await $rechargefetch("@post/recharge-online", {
        body: input,
      }),
    onError(error) {
      notyf.error(error.message);
    },
    onSuccess({ data }) {
      navigate("/pay-online", {
        search: {
          orderId: data.orderId ?? "",
        },
      });
    },
  });

  function handleRecharge() {
    if (activeTab.value === "UPI") {
      return;
    }
    const currency =
      activeTab.value === "BEP 20 online" ? "USDTBSC" : "USDTTRX";
    mutate({ amount: rechargeAmount, currency });
  }

  return (
    <div className="rounded-2xl bg-surface-card border border-border-card/60 p-4 shadow-md space-y-4 my-3">
      <ChannelRates />

      {/* Section title */}
      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-brand-gold fill-brand-gold/20" />
        <h2 className="text-base font-bold text-brand-gold">Deposit amount</h2>
      </div>

      {/* Preset amount grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {PRESET_AMOUNTS_USDT.map((amount) => {
          const isSelected = rechargeAmount === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => {
                setRechargeAmount(amount);
              }}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg h-11 px-2 transition-all duration-150 cursor-pointer border",
                {
                  "bg-linear-to-b from-gold-btn-start via-gold-btn-mid to-gold-btn-end border-gold-btn-border text-brand-gold-dark font-black shadow-md scale-[1.02]":
                    isSelected,
                  "bg-surface-card-header border-transparent text-white font-bold hover:bg-surface-card-active":
                    !isSelected,
                }
              )}
            >
              <span
                className={cn("text-xs", {
                  "text-brand-gold-dark": isSelected,
                  "text-brand-gold-light/90": !isSelected,
                })}
              >
                $
              </span>
              <span className="text-sm">
                {amount >= 1000 ? `${amount / 1000}K` : amount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom amount input box */}
      <div className="flex items-center rounded-xl border border-border-card/80 bg-surface-input-dark px-4 py-3 gap-3 relative">
        <div className="flex items-center gap-2 text-brand-gold font-bold text-lg shrink-0">
          <span>$</span>
          <div className="h-5 w-px bg-border-card/80" />
        </div>

        <input
          type="text"
          value={rechargeAmount}
          onChange={(e) => {
            const value = Number(e.currentTarget.value);
            if (Number.isNaN(value)) {
              return;
            }
            setRechargeAmount(value);
          }}
          className="flex-1 bg-transparent text-brand-gold text-lg font-bold outline-none placeholder:text-text-muted"
          placeholder="Please enter the amount"
        />

        {rechargeAmount > 0 && (
          <button
            type="button"
            onClick={() => setRechargeAmount(0)}
            className="text-text-muted hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Clear amount"
          >
            <XCircle className="h-5 w-5 opacity-60 hover:opacity-100" />
          </button>
        )}
      </div>

      {/* Deposit button */}
      <button
        type="button"
        onClick={handleRecharge}
        disabled={isPending}
        className={cn(
          "w-full rounded-full bg-linear-to-r from-[#eed47e] via-[#f6e497] to-[#e1bc57] py-3 text-base font-black text-brand-gold-dark transition-all shadow-md active:scale-[0.99] cursor-pointer",
          {
            "opacity-60 cursor-not-allowed": isPending,
            "hover:brightness-105": !isPending,
          }
        )}
      >
        {isPending ? "Processing…" : "Deposit"}
      </button>
    </div>
  );
}
