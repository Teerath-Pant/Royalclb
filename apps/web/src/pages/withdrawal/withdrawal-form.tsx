import { useSignals } from "@/lib/signal";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { $userfetch } from "@/api/user";
import { $withdrawalFetch } from "@/api/withdrawal";
import { Link } from "@/components/link";
import { notyf } from "@/lib/notyf";
import { METHOD_META } from "@/pages/withdrawal-methods/config";
import { walletQueryOptions } from "@/queries/wallet";
import {
  withdrawalListQueryOptions,
  withdrawalSettingsQueryOptions,
} from "@/queries/withdrawal";
import { withdrawalMethodsQueryOptions } from "@/queries/withdrawal-methods";
import { cn } from "@/utils/cn";
import { formatAmount } from "@/utils/format-amount";
import { navigate } from "@/utils/navigation";

import {
  activeCurrency,
  activeTab,
  PRESET_AMOUNTS_INR,
  PRESET_AMOUNTS_USDT,
} from "./config";

function maskString(str: string, visibleStart = 4, visibleEnd = 4): string {
  if (!str || str.length <= visibleStart + visibleEnd) {
    return str;
  }
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  return `${start}****${end}`;
}

export function WithdrawalForm() {
  useSignals();
  const currentTab = activeTab.value;
  const currentCurrency = activeCurrency.value;
  const meta = METHOD_META[currentTab];

  // Queries
  const { data: methods } = useQuery(withdrawalMethodsQueryOptions);
  const { data: settings } = useQuery(withdrawalSettingsQueryOptions);
  const { data: twoFa } = useQuery({
    queryKey: ["user", "2fa"],
    queryFn: async () => {
      const { data, error } = await $userfetch("@get/2fa");
      if (error) {
        throw error;
      }
      return data.data;
    },
  });

  const is2faEnabled = twoFa?.enabled ?? false;

  const presetAmounts =
    currentCurrency === "INR" ? PRESET_AMOUNTS_INR : PRESET_AMOUNTS_USDT;

  const [amount, setAmount] = useState<number>(
    currentCurrency === "INR" ? 500 : 10
  );
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    setAmount(currentCurrency === "INR" ? 500 : 10);
  }, [currentCurrency]);

  const configuredMethod = methods?.find((m) => m.type === currentTab);

  // Calculated values
  const isInr = currentCurrency === "INR";
  const symbol = isInr ? "₹" : "$";
  const minWithdraw = isInr
    ? (settings?.minWithdrawInr ?? 500)
    : (settings?.minWithdrawUsd ?? 10);
  const maxWithdraw = isInr
    ? (settings?.maxWithdrawInr ?? 50_000)
    : (settings?.maxWithdrawUsd ?? 5000);
  const withdrawChargePercent = settings?.withdrawCharge ?? 0;
  const usdToInrRate = settings?.usdToInrRate ?? 1;

  // Amount converted to INR if USDT
  const finalAmountInr = isInr ? amount : amount * usdToInrRate;
  const chargeInr = (finalAmountInr * withdrawChargePercent) / 100;
  const netAmountInr = Math.max(0, finalAmountInr - chargeInr);

  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationKey: ["withdrawal", "send-otp"],
    mutationFn: async () => await $withdrawalFetch("@post/send-otp"),
    onSuccess: () => setOtpSent(true),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["withdrawal", "create"],
    mutationFn: async (input: {
      amount: number;
      type: typeof currentTab;
      currency: typeof currentCurrency;
      otp?: string;
    }) =>
      await $withdrawalFetch("@post/", {
        body: input,
      }),
    meta: {
      invalidateQueries: [
        walletQueryOptions.queryKey,
        withdrawalListQueryOptions(null).queryKey,
      ],
    },
    onSuccess: () => {
      setOtp("");
      setOtpSent(false);
    },
  });

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!configuredMethod) {
      navigate("/withdrawal-methods");
      return;
    }

    if (is2faEnabled) {
      if (!otpSent) {
        return notyf.error(
          "Please send and verify the OTP sent to your email first"
        );
      }
      if (otp.length !== 6) {
        return notyf.error("Enter the 6-digit OTP sent to your email");
      }
    }

    mutate({
      amount,
      type: currentTab,
      currency: currentCurrency,
      otp: is2faEnabled ? otp : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 my-3">
      {/* Target Withdrawal Destination Banner */}
      <div className="rounded-2xl bg-surface-card border border-border-card/60 p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-brand-gold" />
            <span className="text-xs font-bold text-brand-gold">
              Withdrawal Destination ({meta.label})
            </span>
          </div>

          <Link
            href="/withdrawal-methods"
            className="flex items-center gap-1 text-xs font-bold text-brand-gold-light/90 hover:text-brand-gold transition-colors cursor-pointer"
          >
            {configuredMethod ? "Edit" : "Configure"}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {configuredMethod ? (
          <div className="pt-2 border-t border-border-card/40 flex justify-between items-center text-xs">
            {configuredMethod.type === "UPI" && (
              <>
                <span className="text-text-muted">UPI ID</span>
                <span className="font-mono font-bold text-white">
                  {maskString(configuredMethod.details.upiId, 3, 3)}
                </span>
              </>
            )}
            {configuredMethod.type === "BANK" && (
              <>
                <span className="text-text-muted">
                  {configuredMethod.details.bankName}
                </span>
                <span className="font-mono font-bold text-white">
                  {maskString(configuredMethod.details.accountNumber, 3, 4)}
                </span>
              </>
            )}
            {(configuredMethod.type === "TRC20" ||
              configuredMethod.type === "BSC") && (
              <>
                <span className="text-text-muted">Wallet Address</span>
                <span className="font-mono font-bold text-white">
                  {maskString(configuredMethod.details.walletAddress, 6, 6)}
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="pt-2 border-t border-border-card/40 flex items-center justify-between text-xs">
            <span className="text-accent-salmon font-medium">
              No {meta.label} withdrawal details set
            </span>
            <Link
              href="/withdrawal-methods"
              className="px-3 py-1 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold font-bold hover:bg-brand-gold/20 transition-all cursor-pointer"
            >
              Add Now
            </Link>
          </div>
        )}
      </div>

      {/* Amount Selection Form */}
      <div className="rounded-2xl bg-surface-card border border-border-card/60 p-4 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-brand-gold" />
          <h2 className="text-sm font-bold text-brand-gold">
            Withdrawal Amount ({symbol})
          </h2>
        </div>

        {/* Preset Amounts Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {presetAmounts.map((preset) => {
            const isSelected = amount === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className={cn(
                  "flex items-center justify-center gap-1 rounded-lg h-11 px-2 transition-all duration-150 cursor-pointer border",
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
                  {symbol}
                </span>
                <span className="text-sm">
                  {preset >= 1000 ? `${preset / 1000}K` : preset}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Input */}
        <div className="flex items-center rounded-xl border border-border-card/80 bg-surface-input-dark px-3.5 py-3 gap-3 focus-within:border-brand-gold/80 focus-within:ring-1 focus-within:ring-brand-gold/30 transition-all">
          <span className="text-brand-gold font-bold text-base shrink-0">
            {symbol}
          </span>
          <div className="h-4 w-px bg-border-card/80" />
          <input
            type="text"
            value={amount}
            onChange={(e) => {
              const val = Number(e.currentTarget.value);
              if (!Number.isNaN(val)) {
                setAmount(val);
              }
            }}
            placeholder="Enter withdrawal amount"
            className="flex-1 bg-transparent text-white text-base font-bold outline-none placeholder:text-text-muted/50"
          />
          {amount > 0 && (
            <button
              type="button"
              onClick={() => setAmount(0)}
              className="text-text-muted hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <XCircle className="h-4 w-4 opacity-60 hover:opacity-100" />
            </button>
          )}
        </div>

        {/* Breakdown & Limits */}
        <div className="space-y-2 text-xs pt-1 border-t border-border-card/40">
          <div className="flex justify-between items-center text-text-subtle">
            <span>Range Limit</span>
            <span className="font-semibold text-white">
              {symbol}
              {minWithdraw} ~ {symbol}
              {maxWithdraw}
            </span>
          </div>

          <div className="flex justify-between items-center text-text-subtle">
            <span>Service Charge ({withdrawChargePercent}%)</span>
            <span className="font-semibold text-accent-salmon">
              - {formatAmount(chargeInr)}
            </span>
          </div>

          {!isInr && (
            <div className="flex justify-between items-center text-text-subtle">
              <span>USDT Exchange Rate</span>
              <span className="font-semibold text-white">
                $1 = ₹{usdToInrRate}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-border-card/30 font-bold">
            <span className="text-brand-gold">Net Amount to Receive</span>
            <span className="text-sm font-black text-white">
              {formatAmount(netAmountInr)}
            </span>
          </div>
        </div>

        {/* Email OTP Verification (only when 2FA is enabled on the account) */}
        {is2faEnabled && (
          <div className="space-y-2 pt-1 border-t border-border-card/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-gold" />
              <h2 className="text-sm font-bold text-brand-gold">
                Email Verification
              </h2>
            </div>

            {otpSent ? (
              <div className="space-y-2">
                <div className="flex items-center rounded-xl border border-border-card/80 bg-surface-input-dark px-3.5 py-3 gap-3 focus-within:border-brand-gold/80 focus-within:ring-1 focus-within:ring-brand-gold/30 transition-all">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.currentTarget.value.replaceAll(/\D/gu, "").slice(0, 6)
                      )
                    }
                    placeholder="Enter 6-digit OTP"
                    className="flex-1 bg-transparent text-white text-base font-bold outline-none placeholder:text-text-muted/50 tracking-widest"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => sendOtp()}
                  disabled={isSendingOtp}
                  className="text-xs font-bold text-brand-gold-light/90 hover:text-brand-gold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Resend OTP
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => sendOtp()}
                disabled={isSendingOtp}
                className={cn(
                  "w-full rounded-xl border border-brand-gold/30 bg-brand-gold/10 py-2.5 text-sm font-bold text-brand-gold transition-all cursor-pointer",
                  {
                    "opacity-60 cursor-not-allowed": isSendingOtp,
                    "hover:bg-brand-gold/20": !isSendingOtp,
                  }
                )}
              >
                {isSendingOtp ? "Sending..." : "Send OTP to my Email"}
              </button>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            isPending ||
            !configuredMethod ||
            (is2faEnabled && (!otpSent || otp.length !== 6))
          }
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-gold-btn-start via-gold-btn-mid to-gold-btn-end py-3.5 text-base font-black text-brand-gold-dark transition-all shadow-md active:scale-[0.99] cursor-pointer mt-2",
            {
              "opacity-60 cursor-not-allowed":
                isPending ||
                !configuredMethod ||
                (is2faEnabled && (!otpSent || otp.length !== 6)),
              "hover:brightness-105":
                !isPending &&
                configuredMethod &&
                (!is2faEnabled || (otpSent && otp.length === 6)),
            }
          )}
        >
          {isPending ? "Processing..." : "Withdraw Now"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
