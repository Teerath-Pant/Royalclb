import { useSignals } from "@/lib/signal";
import { useEffect } from "react";

import { activeModal, closeModal } from "./config";

export function TransferOutModal() {
  useSignals();
  const isOpen = activeModal.value === "transfer-out";

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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="transfer-out-title"
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 p-4 backdrop-blur-xs"
    >
      {/* Click outside backdrop to close */}
      <button
        type="button"
        className="fixed inset-0 h-full w-full cursor-default border-0 bg-transparent"
        onClick={closeModal}
        aria-label="Close modal background"
      />

      {/* Container-width inner: constrains card to app width */}
      <div className="relative z-10 w-full max-w-102.5 flex justify-center">
        <div className="w-full max-w-xs rounded-2xl bg-surface-modal p-6 text-white shadow-2xl border border-border-card flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-salmon/20 text-accent-salmon text-xl font-bold">
            !
          </div>

          <h3
            id="transfer-out-title"
            className="mb-2 text-lg font-bold text-brand-gold-light"
          >
            No income
          </h3>

          <p className="mb-6 text-center text-xs text-text-muted font-medium leading-relaxed">
            No income at the moment, want to transfer out
          </p>

          <button
            type="button"
            onClick={closeModal}
            className="mb-3 w-full rounded-xl bg-linear-to-b from-brand-gold-gradient to-brand-gold py-3 text-sm font-bold text-gray-950 shadow-md cursor-pointer transition-transform active:scale-95 border-0"
          >
            Transfer Out
          </button>

          <button
            type="button"
            onClick={closeModal}
            className="w-full rounded-xl border border-brand-gold bg-transparent py-3 text-sm font-bold text-brand-gold cursor-pointer transition-colors hover:bg-brand-gold/10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
