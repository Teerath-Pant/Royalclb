import { formatAmount } from "@/utils/format-amount";
import { formatISTDate } from "@/utils/format-ist-date";

interface SafeTransaction {
  id: number;
  userId: number;
  type: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
}

interface TransactionCardProps {
  transaction: SafeTransaction;
}

function formatTransactionType(type: string): string {
  return type
    .replaceAll("-", " ")
    .replaceAll(/\b\w/gu, (char) => char.toUpperCase());
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const isDepositOrIn =
    transaction.type.toLowerCase().includes("deposit") ||
    transaction.type.toLowerCase().includes("in");

  const formattedType = formatTransactionType(transaction.type);

  return (
    <div className="bg-surface-card rounded-xl p-4 mb-3 shadow-sm border border-border-card/40 space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-brand-gold-light text-sm font-bold">
          {formattedType}
        </div>
        <div
          className={`text-base font-extrabold tracking-tight ${
            isDepositOrIn ? "text-accent-teal" : "text-accent-salmon"
          }`}
        >
          {isDepositOrIn ? "+" : "-"}
          {formatAmount(transaction.amount)}
        </div>
      </div>

      <div className="flex justify-between items-center text-xs text-text-muted font-medium pt-1 border-t border-border-card/30">
        <div>{formatISTDate(transaction.createdAt)}</div>
        <div>
          Balance:{" "}
          <span className="text-brand-gold font-semibold">
            {formatAmount(transaction.balanceAfter)}
          </span>
        </div>
      </div>
    </div>
  );
}
