interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = "No records found" }: EmptyStateProps) {
  return (
    <div className="py-8 px-4 text-center bg-surface-card rounded-xl my-3 border border-border-card/40">
      <div className="text-3xl mb-2 opacity-60">📜</div>
      <div className="text-text-muted text-xs font-medium">{message}</div>
    </div>
  );
}
