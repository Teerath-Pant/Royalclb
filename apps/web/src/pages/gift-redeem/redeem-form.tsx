import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { FormEvent } from "react";

import { $giftCodeFetch } from "@/api/gift-code";
import { notyf } from "@/lib/notyf";
import { claimHistoryQueryOptions } from "@/queries/gift-code";
import { walletQueryOptions } from "@/queries/wallet";

export function RedeemForm() {
  const [code, setCode] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async (inputCode: string) =>
      await $giftCodeFetch("@post/claim", {
        body: { code: inputCode },
      }),
    onSuccess: () => {
      setCode("");
    },
    meta: {
      invalidateQueries: [
        walletQueryOptions.queryKey,
        claimHistoryQueryOptions.queryKey,
      ],
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      notyf.error("Please enter a gift code");
      return;
    }
    mutate(trimmed);
  }

  return (
    <div style={{ padding: "5px 15px" }}>
      <div className="gift-card">
        <div className="gift-title">Hi</div>
        <div className="gift-subtitle">We have a gift for you</div>

        <div style={{ fontSize: "14px", color: "#FDE4BC" }}>
          Please enter the gift code below
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="gift-input"
            placeholder="Please enter gift code"
            value={code}
            onChange={(e) => setCode(e.currentTarget.value)}
            disabled={isPending}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
          />

          <button
            className="gift-btn"
            type="submit"
            disabled={isPending}
            style={isPending ? { opacity: 0.7, cursor: "not-allowed" } : {}}
          >
            {isPending ? "Redeeming..." : "Receive"}
          </button>
        </form>
      </div>
    </div>
  );
}
