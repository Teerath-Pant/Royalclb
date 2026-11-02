import { useState } from "react";

import { HistoryTabs } from "./history-tabs";
import type { HistoryTab } from "./history-tabs";
import { InterestLogsList } from "./interest-logs-list";
import { TransactionsList } from "./transactions-list";

export function History() {
  const [activeTab, setActiveTab] = useState<HistoryTab>("interest-logs");

  return (
    <div className="pt-2">
      {/* Historical records header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-5 bg-brand-gold rounded-md flex items-center justify-center text-black font-extrabold text-xs shadow-xs">
          <div className="w-2.5 h-2.5 border-2 border-gray-950 rounded-xs" />
        </div>
        <h3 className="m-0 text-base text-brand-gold font-bold tracking-tight">
          Historical records
        </h3>
      </div>

      {/* Tabs */}
      <HistoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === "interest-logs" ? (
        <div
          role="tabpanel"
          id="interest-logs-panel"
          aria-labelledby="tab-interest-logs"
        >
          <InterestLogsList />
        </div>
      ) : (
        <div
          role="tabpanel"
          id="transactions-panel"
          aria-labelledby="tab-transactions"
        >
          <TransactionsList />
        </div>
      )}
    </div>
  );
}
