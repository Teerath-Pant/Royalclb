/** Legacy pages: the PHP markup (generated into ./pages) with its data and behaviour wired up. */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { ComponentType, FormEvent } from "react";

import { WalletBalance } from "@/components/wallet-balance";
import { api, apiPost } from "@/lib/api";
import { profileQuery } from "@/queries/profile";
import { navigate } from "@/utils/navigation";

import { useSearch } from "wouter";

import { fetchAll, phpRow, withFrom } from "./data";
import { initTeamReport } from "./team-report";
import { GiftRedeem } from "@/pages/gift-redeem";
import { LegacyPage } from "./use-legacy";
import { legacy as giftRedeemCss } from "./pages/GiftRedeemShell";
import { screen } from "./screen";
import type { Loader, Row } from "./screen";
import type { Handlers, LegacyStyles } from "./use-legacy";
import { date, formatAmount, number_format } from "./php";

const useProfile = () => useQuery(profileQuery).data;
const money = (v: string | number | undefined) => formatAmount(Number(v ?? 0));

// ---------------------------------------------------------------------------------------------- static pages

export const About = screen(() => import("./pages/About"), "AboutView", "about.php");
export const Activity = screen(() => import("./pages/Activity"), "ActivityView", "activity.php");
export const Vip = screen(() => import("./pages/Vip"), "VipView", "vip.php", () => {
  useSwiper({ loop: true, navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }, pagination: { el: ".swiper-pagination", clickable: true }, slidesPerView: 1, spaceBetween: 10 });
  return {};
});

declare global {
  interface Window {
    // oxlint-disable-next-line typescript/no-explicit-any
    Swiper?: new (selector: string, options: Row) => any;
  }
}

/** The pages used the bundled Swiper build; load that file once and initialise it on the page's carousel. */
function useSwiper(options: Row) {
  useEffect(() => {
    let swiper: { destroy?: (a?: boolean, b?: boolean) => void } | undefined;
    const start = () => {
      if (window.Swiper && document.querySelector(".swiper-container")) {
        swiper = new window.Swiper(".swiper-container", options);
      }
    };
    if (window.Swiper) {
      start();
    } else {
      const script = document.createElement("script");
      script.src = "/User/css/swiper-bundle.min.js";
      script.onload = start;
      document.head.append(script);
    }
    return () => swiper?.destroy?.(true, true);
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// ---------------------------------------------------------------------------------------------- account area

export const Settings = screen(() => import("./pages/Settings"), "SettingsView", "settings.php", () => {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["2fa"], queryFn: () => api<{ enabled: boolean }>("/user/2fa") });
  const toggle = useMutation({
    mutationFn: (enabled: boolean) => apiPost("/user/2fa", { enabled }, "PUT"),
    onSettled: () => qc.invalidateQueries({ queryKey: ["2fa"] }),
  });

  // The template renders the toggle as a plain checkbox; drive it like the original script did.
  useEffect(() => {
    const box = document.querySelector<HTMLInputElement>("#twoFactorToggle");
    if (!box) {
      return;
    }
    box.checked = data?.enabled ?? false;
    const onChange = () => toggle.mutate(box.checked);
    box.addEventListener("change", onChange);
    return () => box.removeEventListener("change", onChange);
  });
  return {};
});

export const Account = screen(() => import("./pages/Account"), "AccountView", "account.php", () => {
  const profile = useProfile();
  const qc = useQueryClient();
  const logout = useMutation({
    mutationFn: () => apiPost("/auth/logout"),
    onSuccess: () => {
      qc.clear();
      navigate("/login", { replace: true });
    },
  });

  useEffect(() => {
    const button = document.querySelector("#logoutButton");
    const run = () => logout.mutate();
    button?.addEventListener("click", run);
    return () => button?.removeEventListener("click", run);
  });

  const dialog = (cls: string) => () => {
    const el = document.getElementById("loginaction");
    if (el) {
      el.className = cls;
    }
  };
  return {
    ready: Boolean(profile),
    handlers: { logoutaction: (arg) => dialog(arg === "1" ? "dialog active" : "dialog inactive")() },
    props: profile && {
      userName: profile.name,
      uid: String(profile.uid),
      referralCode: profile.referralCode,
      totalWallet: money(profile.totalWallet),
      roiIncome: profile.roiIncome,
    },
  };
});

function useDialogMessage() {
  return (message: string) => {
    const h1 = document.getElementById("messages");
    const dialog = document.getElementById("first-dialog");
    if (h1 && dialog) {
      h1.textContent = message;
      dialog.className = "dialog active";
    }
  };
}

const closeDialog: Handlers = {
  closedialog: () => {
    const dialog = document.getElementById("first-dialog");
    if (dialog) {
      dialog.className = "dialog inactive";
    }
  },
};

export const Profile = screen(() => import("./pages/Profile"), "ProfileView", "profile.php", () => {
  const profile = useProfile();
  const qc = useQueryClient();
  const show = useDialogMessage();
  const save = useMutation({
    mutationFn: (name: string) => apiPost("/user/profile", { name }, "PATCH"),
    onSuccess: (res) => {
      show(res.message);
      return qc.invalidateQueries({ queryKey: profileQuery.queryKey });
    },
    onError: (e) => show(e.message),
  });
  return {
    ready: Boolean(profile),
    handlers: closeDialog,
    onSubmit: (e) => {
      e.preventDefault();
      save.mutate(String(new FormData(e.target as HTMLFormElement).get("name") ?? ""));
    },
    props: profile && { memberId: profile.memberId, uid: String(profile.uid), userName: profile.name, phone: profile.phone, emailId: profile.email },
  };
});

export const ChangePassword = screen(() => import("./pages/ChangePassword"), "ChangePasswordView", "change_password.php", () => {
  const profile = useProfile();
  const qc = useQueryClient();
  const show = useDialogMessage();
  const change = useMutation({
    mutationFn: (body: { oldPassword: string; newPassword: string }) => apiPost("/user/change-password", body),
    onSuccess: () => {
      qc.clear();
      navigate("/login", { replace: true });
    },
    onError: (e) => show(e.message),
  });
  return {
    ready: Boolean(profile),
    handlers: closeDialog,
    onSubmit: (e) => {
      e.preventDefault();
      const form = new FormData(e.target as HTMLFormElement);
      if (form.get("new_pass") !== form.get("co_pass")) {
        show("New password and confirm password do not match");
        return;
      }
      change.mutate({ oldPassword: String(form.get("old_pass")), newPassword: String(form.get("new_pass")) });
    },
    props: profile && { memberId: profile.memberId },
  };
});

// ---------------------------------------------------------------------------------------------- home, wallet, promotion

type HomeData = {
  banners: { id: number; image: string }[];
  news: string | null;
  miscConfig: { dashboardImage: string | null; imageStatus: number } | null;
  approvedRechargeCount: number;
  usdToInrRate: number;
  telegramLink: string;
};
type FirstDeposit = {
  usdToInrRate: number;
  eligibleFirstDeposit: number;
  tiers: { deposit: number; bonus: number; deposit_raw: number; bonus_raw: number; is_eligible: boolean }[];
};

const useFirstDeposit = () => useQuery({ queryKey: ["first-deposit-bonus"], queryFn: () => api<FirstDeposit>("/user/first-deposit-bonus") }).data;

export const Home = screen(() => import("./pages/Home"), "HomeView", "home.php", () => {
  const profile = useProfile();
  const home = useQuery({ queryKey: ["home"], queryFn: () => api<HomeData>("/user/home") }).data;
  const first = useFirstDeposit();
  useSwiper({ loop: true, pagination: { el: ".swiper-pagination", clickable: true }, autoplay: { delay: 5000, disableOnInteraction: false } });

  // First-deposit reminder: shown once a day unless dismissed, like the original script.
  useEffect(() => {
    const dialog = document.getElementById("homeFirstDepositDialog");
    const overlay = document.getElementById("homeFirstDepositOverlay");
    if (!dialog || !overlay) {
      return;
    }
    const key = `home-first-deposit-dismissed-${new Date().toISOString().slice(0, 10)}`;
    const close = () => {
      dialog.style.display = "none";
      overlay.style.display = "none";
      document.body.classList.remove("van-overflow-hidden");
    };
    if (!localStorage.getItem(key)) {
      dialog.style.display = "flex";
      overlay.style.display = "block";
      document.body.classList.add("van-overflow-hidden");
    }
    const closeButton = document.getElementById("homeFirstDepositClose");
    const today = document.getElementById("homeFirstDepositToday") as HTMLInputElement | null;
    const remember = () => today?.checked && localStorage.setItem(key, "1");
    closeButton?.addEventListener("click", close);
    overlay.addEventListener("click", close);
    today?.addEventListener("change", remember);
    return () => {
      closeButton?.removeEventListener("click", close);
      overlay.removeEventListener("click", close);
      today?.removeEventListener("change", remember);
      document.body.classList.remove("van-overflow-hidden");
    };
  }, [home, first]);

  return {
    ready: Boolean(profile && home && first),
    props: profile &&
      home && {
        totalWallet: money(profile.totalWallet),
        walletBalance: <WalletBalance />,
        banners: home.banners.map((b) => ({ payment_id: b.id, paymentImage: b.image })),
        newsConfig: home.news ? { news: home.news, newStatus: 1 } : null,
        miscConfig: home.miscConfig,
        approvedRechargeCount: home.approvedRechargeCount,
        usdToInrRate: home.usdToInrRate,
        telegramLink: home.telegramLink,
        firstDepositTiers: first?.tiers.map((t) => ({ ...t })) ?? [],
      },
  };
});

const SUMMARY: [string, string][] = [
  ["Today Income", "todayIncome"],
  ["Total Income", "totalIncome"],
  ["Deposit Amount", "depositAmount"],
  ["1st & 2nd Deposit Bonus", "depBonus12"],
  ["3rd, 4th & 5th Deposit Bonus", "depBonus345"],
  ["Daily Deposit Bonus", "dailyDepBonus"],
  ["USDT Deposit Bonus", "usdDepositBonus"],
  ["Daily Attendance Bonus", "attendanceBonus"],
  ["Bet Commission", "betCommission"],
  ["Daily Rebate Income", "rebateIncome"],
  ["Total Withdrawal", "totalWithdrawal"],
];

export const Wallet = screen(() => import("./pages/Wallet"), "WalletView", "wallet.php", () => {
  const stats = useQuery({ queryKey: ["wallet-summary"], queryFn: () => api<Record<string, number> & { totalWallet: string }>("/user/wallet-summary") }).data;
  return {
    ready: Boolean(stats),
    props: stats && {
      totalWallet: money(stats.totalWallet),
      summaryCards: SUMMARY.map(([title, key]) => ({ title, amount: stats[key] ?? 0 })),
    },
  };
});

export const Promotion = screen(() => import("./pages/Promotion"), "PromotionView", "promotion.php", () => {
  const stats = useQuery({ queryKey: ["promotion"], queryFn: () => api<Row>("/user/promotion") }).data;

  // ClipboardJS is replaced by the clipboard API: copy the button's text, flash the toast for a second.
  useEffect(() => {
    const onClick = async (e: MouseEvent) => {
      const button = (e.target as Element).closest<HTMLElement>(".copyBtn, [data-clipboard-text]");
      if (!button) {
        return;
      }
      await navigator.clipboard.writeText(button.dataset.clipboardText ?? "");
      const toast = document.getElementById("copymsg");
      if (toast) {
        toast.style.display = "block";
        setTimeout(() => (toast.style.display = "none"), 1000);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return {
    ready: Boolean(stats),
    props: stats && {
      stats,
      referralCode: stats.referralCode,
      referralUrl: `${window.location.origin}/register?referralCode=${encodeURIComponent(stats.referralCode)}`,
    },
  };
});

export const FirstDepositBonus = screen(() => import("./pages/FirstDepositBonus"), "FirstDepositBonusView", "first-deposit-bonus.php", () => {
  const first = useFirstDeposit();
  const rate = first?.usdToInrRate ?? 1;
  return {
    ready: Boolean(first),
    props: first && {
      depositTiers: first.tiers.map((t) => ({ deposit: t.deposit_raw, bonus: t.bonus_raw })),
      eligibleFirstDeposit: first.eligibleFirstDeposit,
      highestBonus: first.tiers.length ? Math.max(...first.tiers.map((t) => t.bonus_raw)) / rate : 0,
      usdToInrRate: rate,
    },
  };
});

// ---------------------------------------------------------------------------------------------- list pages

function listScreen(load: Loader, viewName: string, currentPage: string, prop: string, path: string, map: (row: Row) => Row = (r) => r) {
  return screen(load, viewName, currentPage, () => {
    const rows = useQuery({ queryKey: ["legacy", path], queryFn: () => fetchAll<Row>(path) }).data;
    return { ready: Boolean(rows), props: { [prop]: rows?.map(map) } };
  });
}

const income = (type: string) => `/income/${type}`;

export const DailyRebate = listScreen(() => import("./pages/DailyRebate"), "DailyRebateView", "daily_rebate.php", "queryRebate", income("daily-rebate"));
export const DailyRecharge = listScreen(() => import("./pages/DailyRecharge"), "DailyRechargeView", "daily_Recharge.php", "querySalaryBonus", income("daily-recharge"));
export const DailyFundRoi = listScreen(() => import("./pages/DailyFundRoi"), "DailyFundRoiView", "daily_fund_roi.php", "queryRoi", income("daily-fund-roi"));
export const LevelIncome = listScreen(() => import("./pages/LevelIncome"), "LevelIncomeView", "level_income.php", "queryTradeCommission", income("level"), withFrom);
export const ReferralBonus = listScreen(() => import("./pages/ReferralBonus"), "ReferralBonusView", "referral_bonus.php", "querySalaryBonus", income("referral"), withFrom);
export const ReferralLevelBonus = listScreen(() => import("./pages/ReferralLevelBonus"), "ReferralLevelBonusView", "referralLevel_bonus.php", "querySalaryBonus", income("referral-level"), withFrom);
export const RescueBonus = listScreen(() => import("./pages/RescueBonus"), "RescueBonusView", "rescue_bonus.php", "querySalaryBonus", income("rescue"));
export const SalaryIncome = listScreen(() => import("./pages/SalaryIncome"), "SalaryIncomeView", "salary_income.php", "querySalaryBonus", income("salary"));
export const WinningStreakIncome = listScreen(() => import("./pages/WinningStreakIncome"), "WinningStreakIncomeView", "winning_streak_income.php", "querySalaryBonus", income("winning-streak"));
export const UsdDepositBonus = screen(() => import("./pages/UsdDepositBonus"), "UsdDepositBonusView", "usdDepositBonus.php", () => {
  const profile = useProfile();
  const rows = useQuery({ queryKey: ["legacy", income("usd-deposit-bonus")], queryFn: () => fetchAll<Row>(income("usd-deposit-bonus")) }).data;
  return { ready: Boolean(profile && rows), props: { bonusHistory: rows, memberId: profile?.memberId } };
});
export const Direct = listScreen(() => import("./pages/Direct"), "DirectView", "direct.php", "queryDirect", "/user/direct");

function depositBonus(load: Loader, viewName: string, currentPage: string, type: string) {
  return screen(load, viewName, currentPage, () => {
    const profile = useProfile();
    const rows = useQuery({ queryKey: ["legacy", type], queryFn: () => fetchAll<Row>(income(type)) }).data;
    const people = new Map<number, Row>(rows?.map((r) => [r.fromId, r.from ?? {}]) ?? []);
    const pick = (id: number, key: "name" | "userId") => (id === profile?.memberId ? (key === "name" ? profile.name : profile.referralCode) : (people.get(id)?.[key] ?? ""));
    return {
      ready: Boolean(profile && rows),
      props: { result: rows?.map((r) => ({ ...r, income_from: r.fromId, member_id: profile?.memberId })), memberId: profile?.memberId, name: (id: number) => pick(id, "name"), user_id: (id: number) => pick(id, "userId") },
    };
  });
}
export const DepositBonus = depositBonus(() => import("./pages/DepositBonus"), "DepositBonusView", "depositBonus.php", "deposit-bonus");
export const DepositBonus12 = depositBonus(() => import("./pages/DepositBonus12"), "DepositBonus12View", "depositBonus1_2.php", "deposit-bonus-1-2");
export const DepositBonus345 = depositBonus(() => import("./pages/DepositBonus345"), "DepositBonus345View", "depositBonus3_4_5.php", "deposit-bonus-3-4-5");

export const WalletStatement = screen(() => import("./pages/WalletStatement"), "WalletStatementView", "walletStatement.php", () => {
  const profile = useProfile();
  const rows = useQuery({ queryKey: ["legacy", "statement"], queryFn: () => fetchAll<Row>("/user/statement") }).data;
  return {
    ready: Boolean(profile && rows),
    // The old query joined the member row, so every line printed the member's income wallet balance as `wallet`.
    // `type` stays as stored (CREDIT/DEBIT): the template compared it with lowercase words, so it showed "Credit" for every line.
    props: { queryRequest: rows?.map((r) => ({ ...r, wallet: profile?.wallet })) },
  };
});

export const Team = screen(() => import("./pages/Team"), "TeamView", "team.php", () => {
  const rows = useQuery({ queryKey: ["legacy", "team"], queryFn: () => fetchAll<Row>("/user/team") }).data;
  const byId = new Map<number, Row>(rows?.map((r) => [r.member_id, r]) ?? []);
  return {
    ready: Boolean(rows),
    props: {
      queryTeam: rows?.map((r) => ({ ...r, referral_user_id: r.referralUserId })),
      totalInvest: (id: number) => number_format(byId.get(id)?.totalDeposit ?? 0, 2, ".", ""),
    },
  };
});

export const NewRegistration = screen(() => import("./pages/NewRegistration"), "NewRegistrationView", "new_registration.php", () => {
  const rows = useQuery({ queryKey: ["new-registrations"], queryFn: async () => phpRow(await api<Row[]>("/user/new-registrations")) }).data;
  return { ready: Boolean(rows), props: { children: rows, totalInvest: () => "0.00" } };
});

type AttendanceData = {
  totalClaimed: string;
  totalAttended: number;
  days: { day: number; betNeed: string; bonus: string; id: number | null; status: "PENDING" | "CLAIMABLE" | "CLAIMED" }[];
};

const BUTTON = {
  PENDING: { btnClass: "", btnAttr: "disabled", btnText: "Pending" },
  CLAIMED: { btnClass: "claimed", btnAttr: "", btnText: "Claimed" },
  CLAIMABLE: { btnClass: "claimable", btnAttr: "", btnText: "Claim" },
};

export const Attendance = screen(() => import("./pages/Attendance"), "AttendanceView", "attendance.php", () => {
  const qc = useQueryClient();
  const data = useQuery({ queryKey: ["attendance"], queryFn: () => api<AttendanceData>("/attendance") }).data;
  const claim = useMutation({
    mutationFn: (id: string) => apiPost(`/attendance/${id}/claim`),
    meta: { invalidateQueries: [["attendance"], ["wallet-summary"], profileQuery.queryKey] },
  });
  const row = (d: AttendanceData["days"][number]) => ({
    day: d.day,
    bet_need: d.betNeed,
    bonus: d.bonus,
    ...BUTTON[d.status],
    achievedId: d.id ?? "",
    claimable: d.status === "CLAIMABLE",
  });
  void qc;
  return {
    ready: Boolean(data),
    // The claim buttons submit hidden forms, as the PHP page did; the call goes to the API instead.
    onSubmit: (e) => {
      e.preventDefault();
      claim.mutate(String(new FormData(e.target as HTMLFormElement).get("attendenc_id")));
    },
    props: data && {
      totalAttended: data.totalAttended,
      totalBet: data.totalClaimed,
      rewards: data.days.filter((d) => d.day !== 7).map(row),
      day7: data.days.find((d) => d.day === 7) ? row(data.days.find((d) => d.day === 7)!) : null,
    },
  };
});

export const TeamReport = screen(() => import("./pages/TeamReport"), "TeamReportView", "TeamReport.php", () => {
  useEffect(() => initTeamReport(), []);
  return {};
});

export const ViewCommission = screen(() => import("./pages/ViewCommission"), "ViewCommissionView", "viewCommission.php", () => {
  const params = new URLSearchParams(useSearch());
  const today = date("Y-m-d");
  const from = params.get("from_date") || today;
  const to = params.get("to_date") || today;
  const sum = useQuery({
    queryKey: ["commission-summary", from, to],
    queryFn: () => api<{ totalCommission: string }>(`/income/commission-summary?from=${from}&to=${to}`),
  }).data;
  return {
    ready: Boolean(sum),
    // The form is a plain GET; submitting it reloads the report for the chosen dates.
    onSubmit: (e) => {
      e.preventDefault();
      const form = new FormData(e.target as HTMLFormElement);
      navigate(`/commission?from_date=${form.get("from_date")}&to_date=${form.get("to_date")}`);
    },
    props: { _GET: Object.fromEntries(params), valSum: { total_commission: sum?.totalCommission ?? "0.00" } },
  };
});

// The gift page was a Preact app inside the PHP shell's #gift-redeem; it keeps its own markup and the shell's CSS.
export function GiftRedeemScreen() {
  return (
    <LegacyPage legacy={giftRedeemCss}>
      <div id="app" data-v-app="" style={{ minHeight: "100vh" }}>
        <div id="gift-redeem">
          <GiftRedeem />
        </div>
      </div>
    </LegacyPage>
  );
}

function readBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });
}

export const Support = screen(() => import("./pages/Support"), "SupportView", "support.php", () => {
  const profile = useProfile();
  const qc = useQueryClient();
  const subjects = useQuery({ queryKey: ["support-subjects"], queryFn: () => api<Row[]>("/support/subjects") }).data;
  const tickets = useQuery({ queryKey: ["support-tickets"], queryFn: async () => phpRow(await api<Row[]>("/support/tickets")) }).data;

  const submit = useMutation({
    mutationFn: async (form: FormData) => {
      const file = form.get("transactionImage");
      return apiPost("/support/tickets", {
        subjectId: Number(form.get("subjectId")),
        message: String(form.get("ticketMessage") ?? ""),
        fileBase64: file instanceof File && file.size > 0 ? await readBase64(file) : undefined,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["support-tickets"] }),
  });

  return {
    ready: Boolean(profile && subjects && tickets),
    handlers: closeDialog,
    onSubmit: (e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      submit.mutate(new FormData(form), { onSuccess: () => form.reset() });
    },
    props: {
      memberId: profile?.memberId,
      querySubject: subjects,
      queryRequest: tickets?.map((r) => ({
        ...r,
        subjectName: r.subject,
        // The template prefixed "../" to the stored file path; the API serves the file at this path instead.
        transactionImage: r.hasAttachment ? `api/support/tickets/${r.ticketId}/attachment` : "",
        user_id: profile?.referralCode,
        name: profile?.name,
      })),
    },
  };
});
