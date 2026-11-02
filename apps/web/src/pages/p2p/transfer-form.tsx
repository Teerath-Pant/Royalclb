import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRightLeft,
  CheckCircle2,
  Loader2,
  User,
  WalletCards,
} from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";

import { $p2pFetch } from "@/api/p2p";
import { notyf } from "@/lib/notyf";
import { fetchUserName } from "@/queries/p2p";
import { walletQueryOptions } from "@/queries/wallet";
import { cn } from "@/utils/cn";

export function TransferForm() {
  const queryClient = useQueryClient();
  const { data: wallets } = useQuery(walletQueryOptions);
  const availableBalance = wallets?.wallet ?? 0;

  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lastLookupId, setLastLookupId] = useState("");
  const [amount, setAmount] = useState("");

  const numAmount = Number.parseFloat(amount);
  const isInsufficient =
    !Number.isNaN(numAmount) && numAmount > availableBalance;

  const handleLookupUser = async (id: string) => {
    const trimmed = id.trim();
    if (!trimmed || trimmed === lastLookupId) {
      return;
    }

    setIsLookingUp(true);
    setLastLookupId(trimmed);

    try {
      const name = await fetchUserName(trimmed);
      if (name) {
        setUserName(name);
      } else {
        setUserName("");
        notyf.error("Invalid user ID");
      }
    } finally {
      setIsLookingUp(false);
    }
  };

  const transferMutation = useMutation({
    mutationFn: async (payload: { id: number; amount: number }) => {
      const { data, error } = await $p2pFetch("@post/transfer", {
        body: payload,
      });

      if (error) {
        throw error;
      }

      return data;
    },
    meta: {
      invalidateQueries: [walletQueryOptions.queryKey, ["p2p", "history"]],
      successMessage: "Fund transferred successfully",
    },
    onSuccess: () => {
      queryClient.invalidateQueries(walletQueryOptions);
      setUserId("");
      setUserName("");
      setLastLookupId("");
      setAmount("");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedUserId = userId.trim();
    if (!trimmedUserId || Number.isNaN(Number(trimmedUserId))) {
      notyf.error("Please enter a valid user id");
      return;
    }

    const parsedAmount = Number.parseFloat(amount);
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      notyf.error("Please enter a valid amount");
      return;
    }

    if (parsedAmount > availableBalance) {
      notyf.error("Insufficient balance in wallet");
      return;
    }

    transferMutation.mutate({
      id: Number.parseInt(trimmedUserId, 10),
      amount: parsedAmount,
    });
  };

  return (
    <div className="rounded-2xl bg-surface-card border border-border-card/60 p-4 shadow-md space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-border-card/40 pb-3">
        <ArrowRightLeft className="h-5 w-5 text-brand-gold" />
        <h2 className="text-sm font-bold text-brand-gold-light">
          P2P Transfer
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User ID Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="p2p-user-id"
            className="block text-xs font-semibold text-brand-gold-light"
          >
            User ID
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-text-muted flex items-center pointer-events-none">
              <User size={16} />
            </div>
            <input
              id="p2p-user-id"
              type="text"
              inputMode="numeric"
              value={userId}
              onChange={(e) => {
                const val = e.currentTarget.value;
                setUserId(val);
                if (!val) {
                  setUserName("");
                  setLastLookupId("");
                }
              }}
              onBlur={() => handleLookupUser(userId)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLookupUser(userId);
                }
              }}
              placeholder="e.g. 10001"
              className="w-full rounded-xl bg-surface-input border border-border-card py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-text-muted focus:border-brand-gold focus:outline-none transition-colors"
            />
            {isLookingUp && (
              <div className="absolute right-3 text-brand-gold flex items-center">
                <Loader2 size={16} className="animate-spin" />
              </div>
            )}
            {!isLookingUp && userName && (
              <div className="absolute right-3 text-emerald-400 flex items-center">
                <CheckCircle2 size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Name Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="p2p-user-name"
            className="block text-xs font-semibold text-brand-gold-light"
          >
            Name
          </label>
          <div className="relative flex items-center">
            <input
              id="p2p-user-name"
              type="text"
              value={userName}
              readOnly
              placeholder={isLookingUp ? "Fetching name..." : "Recipient name"}
              className="w-full rounded-xl bg-surface-input/60 border border-border-card/60 py-2.5 px-3 text-sm text-text-subtle placeholder:text-text-muted cursor-not-allowed focus:outline-none"
            />
          </div>
        </div>

        {/* Amount Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="p2p-amount"
            className="block text-xs font-semibold text-brand-gold-light"
          >
            Amount ₹
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-text-muted flex items-center pointer-events-none">
              <WalletCards size={16} />
            </div>
            <input
              id="p2p-amount"
              type="number"
              step="any"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
              placeholder="Please Enter Amount"
              className={cn(
                "w-full rounded-xl bg-surface-input border py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-text-muted focus:outline-none transition-colors",
                isInsufficient
                  ? "border-red-500/80 focus:border-red-500"
                  : "border-border-card focus:border-brand-gold"
              )}
            />
          </div>
          <div className="flex items-center justify-between text-xs px-1 pt-0.5">
            <span
              className={cn(
                isInsufficient ? "text-red-400 font-medium" : "text-text-muted"
              )}
            >
              {isInsufficient
                ? `Insufficient balance (Max: ₹${availableBalance.toFixed(2)})`
                : `Available: ₹${availableBalance.toFixed(2)}`}
            </span>
            {availableBalance > 0 && (
              <button
                type="button"
                onClick={() => setAmount(availableBalance.toString())}
                className="text-brand-gold hover:underline bg-transparent border-0 cursor-pointer p-0 text-xs font-semibold"
              >
                Max
              </button>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            transferMutation.isPending ||
            isLookingUp ||
            isInsufficient ||
            !amount ||
            Number.parseFloat(amount) <= 0
          }
          className={cn(
            "w-full rounded-xl py-3 text-sm font-bold text-bg-page transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md",
            "bg-linear-to-r from-gold-btn-start via-gold-btn-mid to-gold-btn-end hover:brightness-105 active:scale-[0.99]",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          )}
        >
          {transferMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing Transfer...</span>
            </>
          ) : (
            <span>Transfer</span>
          )}
        </button>
      </form>
    </div>
  );
}
