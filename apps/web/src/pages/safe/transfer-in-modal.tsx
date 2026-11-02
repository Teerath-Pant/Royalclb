import { useSignals } from "@/lib/signal";
import { useQuery, useMutation } from "@tanstack/react-query";
import { RotateCw, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { $safeFetch } from "@/api/safe";
import {
  safeBalanceQueryOptions,
  safeSettingsQueryOptions,
  safeTransactionsQueryOptions,
} from "@/queries/safe";
import { walletQueryOptions } from "@/queries/wallet";
import { formatAmount } from "@/utils/format-amount";

import { activeModal, closeModal, showRefreshToast } from "./config";

export function TransferInModal() {
  useSignals();
  const [multiplier, setMultiplier] = useState<string>("2");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isOpen = activeModal.value === "transfer-in";

  const { data: wallets, refetch: refetchWallets } =
    useQuery(walletQueryOptions);
  const { data: settings } = useQuery(safeSettingsQueryOptions);

  const availableBalance = wallets?.fundWallet ?? 0;
  const interestRate = settings?.interestRate ?? 0;
  const baseAmount = settings?.minDepositAmount ?? 100;

  const numMultiplier = Number.parseInt(multiplier, 10) || 0;
  const amountTransferred = numMultiplier * baseAmount;
  const estimatedRevenue = (amountTransferred * interestRate) / 100;

  const isInsufficient = amountTransferred > availableBalance;

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOpen]);

  const depositMutation = useMutation({
    mutationFn: async (amount: number) =>
      await $safeFetch("@post/deposit", {
        body: { amount },
      }),
    onSuccess: () => {
      closeModal();
      setMultiplier("2");
    },
    meta: {
      invalidateQueries: [
        safeBalanceQueryOptions.queryKey,
        safeTransactionsQueryOptions.queryKey,
      ],
    },
  });

  const handleTransfer = () => {
    if (isInsufficient || amountTransferred <= 0) {
      return;
    }
    depositMutation.mutate(amountTransferred);
  };

  const handleAll = () => {
    if (baseAmount > 0) {
      const maxMultiplier = Math.floor(availableBalance / baseAmount);
      setMultiplier(maxMultiplier.toString());
    }
  };

  const handleRefresh = () => {
    refetchWallets();
    showRefreshToast.value = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      showRefreshToast.value = false;
    }, 1500);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="transfer-in-title"
      className="fixed inset-0 z-50 flex justify-center bg-black/70 backdrop-blur-xs"
    >
      {/* Container-width inner: clips both backdrop click area and sheet */}
      <div className="relative w-full max-w-102.5 flex flex-col justify-end">
        {/* Click outside backdrop to close */}
        <button
          type="button"
          className="flex-1 w-full cursor-default border-0 bg-transparent"
          onClick={closeModal}
          aria-label="Close modal background"
        />

        {/* Modal Sheet Content */}
        <div className="rounded-t-3xl bg-surface-modal p-5 text-white shadow-2xl border-t border-border-card">
          <h2
            id="transfer-in-title"
            className="mb-4 text-center text-lg font-bold text-brand-gold-light"
          >
            Transfer In
          </h2>

          {/* Each amount badge */}
          <div className="mb-4 flex justify-center">
            <div className="flex items-center rounded-xl bg-surface-card px-4 py-2 text-xs font-semibold border border-border-card/50 gap-2">
              <span className="text-text-muted">Each amount</span>
              <span className="text-brand-gold font-bold text-sm">
                {baseAmount}
              </span>
            </div>
          </div>

          {/* Input box */}
          <div className="mb-2 flex items-center justify-between rounded-xl bg-surface-input border border-border-card px-4 py-3">
            <input
              type="number"
              min="1"
              value={multiplier}
              onChange={(e) =>
                setMultiplier((e.target as HTMLInputElement).value)
              }
              className="flex-1 bg-transparent text-lg font-bold text-white outline-none"
              placeholder="0"
              aria-label="Multiplier amount"
            />
            <button
              type="button"
              onClick={handleAll}
              className="ml-2 text-sm font-bold text-accent-salmon cursor-pointer hover:underline border-0 bg-transparent"
            >
              All
            </button>
          </div>

          {/* Warning text */}
          <div
            className={`mb-3 flex items-center gap-1.5 text-xs text-accent-salmon ${
              isInsufficient ? "visible" : "invisible"
            }`}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Insufficient amount available</span>
          </div>

          {/* Multiplier Quick Buttons */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            {["2x", "5x", "10x", "50x", "100x", "200x", "500x", "1000x"].map(
              (multiStr) => {
                const val = multiStr.replace("x", "");
                const isSelected = multiplier === val;
                return (
                  <button
                    key={multiStr}
                    type="button"
                    onClick={() => setMultiplier(val)}
                    className={`rounded-xl py-2 text-xs font-bold transition-colors cursor-pointer border-0 ${
                      isSelected
                        ? "bg-brand-gold text-gray-950 shadow-md"
                        : "bg-surface-card text-brand-gold-light hover:bg-[#382b3a]"
                    }`}
                  >
                    {multiStr}
                  </button>
                );
              }
            )}
          </div>

          {/* Details card 1: Available Balance */}
          <div className="mb-2.5 flex items-center justify-between rounded-xl bg-surface-card px-4 py-3 border border-border-card/40">
            <span className="text-xs text-text-muted font-medium">
              Amount available
            </span>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span>{formatAmount(availableBalance)}</span>
              <button
                type="button"
                onClick={handleRefresh}
                className="text-text-muted hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-1"
                aria-label="Refresh balance"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Details card 2: Amount Transferred */}
          <div className="mb-3 flex items-center justify-between rounded-xl bg-surface-card px-4 py-3 border border-border-card/40">
            <span className="text-xs text-text-muted font-medium">
              Amount transferred
            </span>
            <span className="text-sm font-bold text-accent-salmon">
              {formatAmount(amountTransferred)}
            </span>
          </div>

          {/* Estimated Revenue */}
          <div className="mb-4 text-xs font-medium text-text-muted">
            24-hour estimated revenue{" "}
            <strong className="text-accent-salmon font-bold">
              {formatAmount(estimatedRevenue)}
            </strong>
          </div>

          {/* Submit button */}
          <button
            type="button"
            onClick={handleTransfer}
            disabled={
              isInsufficient ||
              amountTransferred <= 0 ||
              depositMutation.isPending
            }
            className={`w-full rounded-xl py-3.5 text-sm font-bold transition-all border-0 ${
              isInsufficient || amountTransferred <= 0
                ? "bg-[#695441] text-[#9c8978] cursor-not-allowed"
                : "bg-brand-gold text-gray-950 hover:bg-brand-gold-hover cursor-pointer shadow-lg"
            } ${depositMutation.isPending ? "opacity-70" : "opacity-100"}`}
          >
            {depositMutation.isPending ? "Transferring..." : "Transfer In"}
          </button>
        </div>
      </div>
    </div>
  );
}
