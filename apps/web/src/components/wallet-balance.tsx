import { RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";

import { useWallet } from "@/hooks/use-wallet";
import { formatAmount } from "@/utils/format-amount";

export function WalletBalance() {
  const { balance, isPending, refresh } = useWallet();
  const [spinning, setSpinning] = useState(false);

  const handleClick = useCallback(() => {
    setSpinning(true);
    refresh();
  }, [refresh]);

  return (
    <span>
      {isPending ? "Loading…" : formatAmount(balance ?? 0)}{" "}
      <button
        type="button"
        className="cursor-pointer align-middle"
        onClick={handleClick}
        aria-label="Refresh wallet balance"
      >
        <RefreshCw
          size={16}
          className={spinning ? "animate-spin" : ""}
          onAnimationIteration={() => setSpinning(false)}
        />
      </button>
    </span>
  );
}
