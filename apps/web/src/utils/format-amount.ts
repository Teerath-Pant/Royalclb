const formatter = Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type Options = {
  symbol?: string;
  position?: "start" | "end";
};

export function formatAmount(value: number, options: Options = {}) {
  const symbol = options.symbol ?? "₹";
  const position = options.position ?? "start";

  const formatted = formatter.format(value);
  if (position === "start") {
    return `${symbol}${formatted}`;
  }
  return `${formatted}${symbol}`;
}
