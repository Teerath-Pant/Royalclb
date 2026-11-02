import { useSignals } from "@/lib/signal";
import { showRefreshToast } from "./config";

export function Toast() {
  useSignals();
  if (!showRefreshToast.value) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/85 rounded-2xl py-4 px-6 flex flex-col items-center justify-center z-50 text-white shadow-2xl backdrop-blur-xs border border-white/10"
    >
      <div className="w-8 h-8 mb-2 flex items-center justify-center text-[#2dd4bf]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div className="text-xs text-center font-bold tracking-wide">
        Refresh
        <br />
        successfully
      </div>
    </div>
  );
}
