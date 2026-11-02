import { useSignals } from "@/lib/signal";
import { useMutation } from "@tanstack/react-query";
import { Building2, CreditCard, Save, User, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import * as v from "valibot";

import type {
  BankDetails,
  BscDetails,
  Trc20Details,
  UpiDetails,
  WithdrawalMethod,
} from "@/api/withdrawal-methods";
import {
  $withdrawalMethodFetch,
  withdrawalMethodSchema,
} from "@/api/withdrawal-methods";
import { withdrawalMethodsQueryOptions } from "@/queries/withdrawal-methods";
import { cn } from "@/utils/cn";

import { activeTab, METHOD_META } from "./config";

interface MethodFormProps {
  existingMethod?: WithdrawalMethod;
}

export function MethodForm({ existingMethod }: MethodFormProps) {
  useSignals();
  const currentTab = activeTab.value;
  const meta = METHOD_META[currentTab];

  // UPI Form state
  const [upiId, setUpiId] = useState("");

  // Bank Form state
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");

  // Crypto Form state
  const [walletAddress, setWalletAddress] = useState("");

  // Field validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill existing details when tab or existing method changes
  useEffect(() => {
    setErrors({});
    if (existingMethod && existingMethod.type === currentTab) {
      if (existingMethod.type === "UPI") {
        setUpiId(existingMethod.details.upiId);
      } else if (existingMethod.type === "BANK") {
        setAccountNumber(existingMethod.details.accountNumber);
        setIfsc(existingMethod.details.ifsc);
        setAccountHolderName(existingMethod.details.accountHolderName);
        setBankName(existingMethod.details.bankName);
      } else if (
        existingMethod.type === "TRC20" ||
        existingMethod.type === "BSC"
      ) {
        setWalletAddress(existingMethod.details.walletAddress);
      }
    } else {
      setUpiId("");
      setAccountNumber("");
      setIfsc("");
      setAccountHolderName("");
      setBankName("");
      setWalletAddress("");
    }
  }, [currentTab, existingMethod]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["withdrawal-methods", "upsert", currentTab],
    mutationFn: async (payload: { type: string; details: unknown }) => {
      if (payload.type === "UPI") {
        return await $withdrawalMethodFetch("@put/UPI", {
          body: { details: payload.details as UpiDetails },
        });
      }
      if (payload.type === "BANK") {
        return await $withdrawalMethodFetch("@put/BANK", {
          body: { details: payload.details as BankDetails },
        });
      }
      if (payload.type === "TRC20") {
        return await $withdrawalMethodFetch("@put/TRC20", {
          body: { details: payload.details as Trc20Details },
        });
      }
      return await $withdrawalMethodFetch("@put/BSC", {
        body: { details: payload.details as BscDetails },
      });
    },
    meta: {
      invalidateQueries: [withdrawalMethodsQueryOptions.queryKey],
    },
  });

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setErrors({});

    let detailsPayload: unknown;

    if (currentTab === "UPI") {
      detailsPayload = { upiId: upiId.trim() };
    } else if (currentTab === "BANK") {
      detailsPayload = {
        accountNumber: accountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        accountHolderName: accountHolderName.trim(),
        bankName: bankName.trim(),
      };
    } else {
      detailsPayload = { walletAddress: walletAddress.trim() };
    }

    // Validate using variant schema
    const validationResult = v.safeParse(withdrawalMethodSchema, {
      type: currentTab,
      details: detailsPayload,
    });

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validationResult.issues) {
        if (issue.path && issue.path.length > 0) {
          const fieldKey = issue.path.at(-1)?.key as string;
          fieldErrors[fieldKey] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    mutate({ type: currentTab, details: detailsPayload });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-surface-card border border-border-card/60 p-5 shadow-md space-y-5 my-4"
    >
      <div className="flex items-center gap-2.5 pb-1 border-b border-border-card/40">
        <Wallet className="h-5 w-5 text-brand-gold fill-brand-gold/20" />
        <h2 className="text-base font-bold text-brand-gold">
          Edit {meta.label} Details
        </h2>
      </div>

      {/* UPI Form */}
      {currentTab === "UPI" && (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-text-gold tracking-wide">
            UPI ID <span className="text-accent-salmon">*</span>
          </label>
          <div className="flex items-center rounded-xl border border-border-card/80 bg-surface-input-dark px-3.5 py-3.5 gap-3 focus-within:border-brand-gold/80 focus-within:ring-1 focus-within:ring-brand-gold/30 transition-all">
            <CreditCard className="h-4 w-4 text-brand-gold shrink-0 opacity-80" />
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.currentTarget.value)}
              placeholder="e.g. username@upi or 9876543210@paytm"
              className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-text-muted/50"
            />
          </div>
          {errors.upiId && (
            <p className="text-xs text-accent-salmon font-medium pt-0.5">
              {errors.upiId}
            </p>
          )}
        </div>
      )}

      {/* Bank Form */}
      {currentTab === "BANK" && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-gold tracking-wide">
              Bank Name <span className="text-accent-salmon">*</span>
            </label>
            <div className="flex items-center rounded-xl border border-border-card/80 bg-surface-input-dark px-3.5 py-3.5 gap-3 focus-within:border-brand-gold/80 focus-within:ring-1 focus-within:ring-brand-gold/30 transition-all">
              <Building2 className="h-4 w-4 text-brand-gold shrink-0 opacity-80" />
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.currentTarget.value)}
                placeholder="e.g. State Bank of India"
                className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-text-muted/50"
              />
            </div>
            {errors.bankName && (
              <p className="text-xs text-accent-salmon font-medium pt-0.5">
                {errors.bankName}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-gold tracking-wide">
              Account Holder Name <span className="text-accent-salmon">*</span>
            </label>
            <div className="flex items-center rounded-xl border border-border-card/80 bg-surface-input-dark px-3.5 py-3.5 gap-3 focus-within:border-brand-gold/80 focus-within:ring-1 focus-within:ring-brand-gold/30 transition-all">
              <User className="h-4 w-4 text-brand-gold shrink-0 opacity-80" />
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.currentTarget.value)}
                placeholder="Name as per bank records"
                className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-text-muted/50"
              />
            </div>
            {errors.accountHolderName && (
              <p className="text-xs text-accent-salmon font-medium pt-0.5">
                {errors.accountHolderName}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-gold tracking-wide">
              Account Number <span className="text-accent-salmon">*</span>
            </label>
            <div className="flex items-center rounded-xl border border-border-card/80 bg-surface-input-dark px-3.5 py-3.5 gap-3 focus-within:border-brand-gold/80 focus-within:ring-1 focus-within:ring-brand-gold/30 transition-all">
              <CreditCard className="h-4 w-4 text-brand-gold shrink-0 opacity-80" />
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.currentTarget.value)}
                placeholder="Bank account number"
                className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-text-muted/50"
              />
            </div>
            {errors.accountNumber && (
              <p className="text-xs text-accent-salmon font-medium pt-0.5">
                {errors.accountNumber}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-text-gold tracking-wide">
              IFSC Code <span className="text-accent-salmon">*</span>
            </label>
            <div className="flex items-center rounded-xl border border-border-card/80 bg-surface-input-dark px-3.5 py-3.5 gap-3 focus-within:border-brand-gold/80 focus-within:ring-1 focus-within:ring-brand-gold/30 transition-all">
              <Building2 className="h-4 w-4 text-brand-gold shrink-0 opacity-80" />
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.currentTarget.value.toUpperCase())}
                placeholder="e.g. SBIN0001234"
                className="flex-1 bg-transparent text-sm font-mono font-semibold text-white uppercase outline-none placeholder:text-text-muted/50"
              />
            </div>
            {errors.ifsc && (
              <p className="text-xs text-accent-salmon font-medium pt-0.5">
                {errors.ifsc}
              </p>
            )}
          </div>
        </div>
      )}

      {/* TRC20 / BSC Form */}
      {(currentTab === "TRC20" || currentTab === "BSC") && (
        <div className="space-y-2">
          <label className="block text-xs font-bold text-text-gold tracking-wide">
            {meta.label} Wallet Address{" "}
            <span className="text-accent-salmon">*</span>
          </label>
          <div className="flex items-center rounded-xl border border-border-card/80 bg-surface-input-dark px-3.5 py-3.5 gap-3 focus-within:border-brand-gold/80 focus-within:ring-1 focus-within:ring-brand-gold/30 transition-all">
            <Wallet className="h-4 w-4 text-brand-gold shrink-0 opacity-80" />
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.currentTarget.value)}
              placeholder={
                currentTab === "TRC20"
                  ? "Starts with T (e.g. TR7NHqje...)"
                  : "Starts with 0x (e.g. 0x71C7...)"
              }
              className="flex-1 bg-transparent text-sm font-mono font-semibold text-white outline-none placeholder:text-text-muted/50"
            />
          </div>
          {errors.walletAddress && (
            <p className="text-xs text-accent-salmon font-medium pt-0.5">
              {errors.walletAddress}
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "w-full flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-gold-btn-start via-gold-btn-mid to-gold-btn-end py-3.5 text-base font-black text-brand-gold-dark transition-all shadow-md active:scale-[0.99] cursor-pointer mt-2",
          {
            "opacity-60 cursor-not-allowed": isPending,
            "hover:brightness-105": !isPending,
          }
        )}
      >
        <Save className="h-4 w-4" />
        {isPending ? "Saving..." : `Save ${meta.label} Details`}
      </button>
    </form>
  );
}
