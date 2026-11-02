import { useSignals } from "@/lib/signal";
import { cn } from "@/utils/cn";

import { activeTab, TABS } from "./config";

const TAB_ICONS: Record<string, string> = {
  UPI: "/assets/images/upi.png",
  "TRC 20": "/assets/images/usdttrc20.svg",
  "BEP 20 online": "/assets/images/usdtbsc.svg",
};

export function Tabs() {
  useSignals();
  return (
    <div className="grid grid-cols-3 gap-2.5 my-3">
      {TABS.map((tab) => {
        const isActive = activeTab.value === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => (activeTab.value = tab)}
            className={cn(
              "relative flex flex-col items-center justify-center h-24 rounded-xl transition-all duration-200 cursor-pointer border",
              {
                "bg-linear-to-b from-[#f3dc86] via-[#e5bf5b] to-[#cb9c37] border-[#fceaa0] text-[#3d2700] shadow-lg scale-[1.02]":
                  isActive,
                "bg-surface-card border-border-card/60 text-text-subtle hover:border-brand-gold/40 hover:bg-[#342735]":
                  !isActive,
              }
            )}
          >
            {/* +3% Tag for Crypto */}
            {["TRC 20", "BEP 20 online"].includes(tab) && (
              <div
                className="absolute top-0 right-1.5 w-9 h-11 bg-linear-to-b from-[#ff5a5a] to-[#e62e2e] text-white flex flex-col items-center pt-1 z-10 shadow-sm"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="#ffdf3b"
                  stroke="#dbab00"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-sm mb-0.5"
                >
                  <rect x="3" y="8" width="18" height="4" rx="1" />
                  <path d="M12 8v13" />
                  <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                  <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                </svg>
                <span className="text-[10px] font-black leading-none drop-shadow-sm">
                  +3%
                </span>
              </div>
            )}

            <div className="flex items-center justify-center h-12 w-12 mb-1.5">
              <img
                src={TAB_ICONS[tab]}
                alt={tab}
                className="h-10 w-10 object-contain z-0 relative"
              />
            </div>
            <span
              className={cn("text-xs font-bold tracking-tight z-0 relative", {
                "text-[#3d2700]": isActive,
                "text-brand-gold-light/80": !isActive,
              })}
            >
              {tab}
            </span>
          </button>
        );
      })}
    </div>
  );
}
