import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/api";

export type Profile = {
  memberId: number;
  wallet: string;
  uid: number;
  referralCode: string | null;
  name: string;
  phone: string;
  email: string;
  vip: number;
  exp: string;
  totalWallet: string;
  roiIncome: string;
};

export const profileQuery = queryOptions({
  queryKey: ["profile"],
  queryFn: () => api<Profile>("/user/profile"),
});
