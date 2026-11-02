export type HistoryTab = "interest-logs" | "transactions";

interface HistoryTabsProps {
  activeTab: HistoryTab;
  onTabChange: (tab: HistoryTab) => void;
}

export function HistoryTabs({ activeTab, onTabChange }: HistoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Historical record tabs"
      className="flex bg-surface-card p-1 rounded-xl mb-4 border border-border-card/50 gap-1"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "interest-logs"}
        aria-controls="interest-logs-panel"
        id="tab-interest-logs"
        onClick={() => onTabChange("interest-logs")}
        className={`flex-1 py-2 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer border-0 ${
          activeTab === "interest-logs"
            ? "bg-brand-gold text-gray-950 shadow-sm"
            : "bg-transparent text-text-muted hover:text-white"
        }`}
      >
        Interest Logs
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "transactions"}
        aria-controls="transactions-panel"
        id="tab-transactions"
        onClick={() => onTabChange("transactions")}
        className={`flex-1 py-2 px-4 text-xs font-bold rounded-lg transition-all cursor-pointer border-0 ${
          activeTab === "transactions"
            ? "bg-brand-gold text-gray-950 shadow-sm"
            : "bg-transparent text-text-muted hover:text-white"
        }`}
      >
        Transactions
      </button>
    </div>
  );
}
