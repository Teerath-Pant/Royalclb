export const WITHDRAWAL_TYPES = ["UPI", "BANK", "TRC20", "BSC"] as const;
export type WithdrawalType = (typeof WITHDRAWAL_TYPES)[number];

export const WITHDRAWAL_CURRENCIES = ["INR", "USD"] as const;
export type WithdrawalCurrency = (typeof WITHDRAWAL_CURRENCIES)[number];

export const WITHDRAWAL_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
export type WithdrawalStatus = (typeof WITHDRAWAL_STATUSES)[number];
