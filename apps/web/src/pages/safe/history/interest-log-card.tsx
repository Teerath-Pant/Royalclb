import { formatAmount } from "@/utils/format-amount";
import { formatISTDate } from "@/utils/format-ist-date";

interface InterestLog {
  id: number;
  userId: number;
  amount: number;
  date: string;
  createdAt: string;
}

interface InterestLogCardProps {
  log: InterestLog;
}

export function InterestLogCard({ log }: InterestLogCardProps) {
  return (
    <div className="bg-surface-card rounded-xl p-4 mb-3 flex justify-between items-center shadow-sm border border-border-card/40">
      <div>
        <div className="text-brand-gold text-sm font-bold mb-1">
          Safe Interest
        </div>
        <div className="text-text-muted text-xs font-medium">
          {formatISTDate(log.createdAt)}
        </div>
      </div>
      <div className="text-accent-teal text-base font-extrabold tracking-tight">
        +{formatAmount(log.amount)}
      </div>
    </div>
  );
}
