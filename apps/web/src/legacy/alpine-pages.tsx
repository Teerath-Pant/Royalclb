/** Register and bet report: ports of register.js and bet_report.js onto the new API. */
import Alpine from "alpinejs";

import { api, apiPost } from "@/lib/api";
import { notyf } from "@/lib/notyf";
import { navigate } from "@/utils/navigation";

import { AlpinePage } from "./alpine";
import { html as betHtml, legacy as betCss } from "./pages/BetReport.html";
import { html as registerHtml, legacy as registerCss } from "./pages/Register.html";

const apiMessage = (error: unknown, fallback = "Something went wrong") => (error instanceof Error && error.message ? error.message : fallback);

// ---------------------------------------------------------------------------------------------- register

function registerData() {
  Alpine.data("register", () => ({
    referralCode: "",
    referralName: "",
    processing: false,
    name: "",
    countryId: "",
    phoneCode: "00",
    phone: "",
    email: "",
    otp: "",
    password: "",
    passwordConfirmation: "",
    sendingOtp: false,
    otpCooldown: 0,
    otpTimer: null as ReturnType<typeof setInterval> | null,

    async sendOtp() {
      if (!this.email) {
        return notyf.error("Email is required");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        return notyf.error("Please enter a valid email address");
      }
      this.sendingOtp = true;
      try {
        notyf.success((await apiPost("/auth/send-otp", { email: this.email })).message);
        this.otpCooldown = 60;
        if (this.otpTimer) {
          clearInterval(this.otpTimer);
        }
        this.otpTimer = setInterval(() => {
          this.otpCooldown--;
          if (this.otpCooldown <= 0 && this.otpTimer) {
            clearInterval(this.otpTimer);
            this.otpTimer = null;
          }
        }, 1000);
      } catch (error) {
        notyf.error(apiMessage(error));
      } finally {
        this.sendingOtp = false;
      }
    },

    async getUserName() {
      if (!this.referralCode) {
        return;
      }
      try {
        this.referralName = (await api<{ name: string }>(`/user/name/${encodeURIComponent(this.referralCode)}`)).name;
      } catch {
        this.referralName = "";
      }
    },

    async submit() {
      const required: [string, string][] = [
        [this.name, "Name is required"],
        [this.countryId, "Country is required"],
        [this.phone, "Phone is required"],
        [this.email, "Email is required"],
        [this.otp, "Verification code (OTP) is required"],
      ];
      const missing = required.find(([value]) => !value);
      if (missing) {
        return notyf.error(missing[1]);
      }
      if (this.otp.length !== 6) {
        return notyf.error("OTP must be 6 digits");
      }
      if (!this.password) {
        return notyf.error("Password is required");
      }
      if (!this.passwordConfirmation) {
        return notyf.error("Password confirmation is required");
      }
      if (this.password !== this.passwordConfirmation) {
        return notyf.error("Passwords do not match");
      }
      this.processing = true;
      try {
        const res = await apiPost("/auth/register", {
          referralCode: this.referralCode,
          name: this.name,
          countryId: Number.parseInt(this.countryId, 10),
          phone: this.phone,
          email: this.email,
          otp: this.otp,
          password: this.password,
        });
        notyf.success(res.message);
        navigate("/login", { replace: true });
      } catch (error) {
        notyf.error(apiMessage(error));
      } finally {
        this.processing = false;
      }
    },
  }));
}

export function Register() {
  // The referral link carries the code (?referralCode=); the PHP page looked the sponsor up server-side.
  const code = new URLSearchParams(window.location.search).get("referralCode");
  const markup = code ? registerHtml.replace("x-data=\"register\"", `x-data="register" x-init="referralCode = '${code.replaceAll(/[^\w-]/g, "")}'; getUserName()"`) : registerHtml;
  return <AlpinePage html={markup} legacy={registerCss} setup={registerData} />;
}

// ---------------------------------------------------------------------------------------------- bet report

type GameKey = "win-go" | "k3" | "aviator";
// oxlint-disable-next-line typescript/no-explicit-any
type Raw = any;

function humanDate(iso: string) {
  return new Date(iso)
    .toLocaleString("en-IN", { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })
    .replace(/\b(am|pm)\b/, (m) => m.toUpperCase());
}

const STATUS_FOR_GAME: Record<GameKey, Record<string, string>> = {
  "win-go": { WIN: "WIN", LOSE: "LOSE", PENDING: "PENDING" },
  k3: { WIN: "WIN", LOSE: "LOSE", PENDING: "PENDING" },
  aviator: { WIN: "CASHED_OUT", LOSE: "LOST", PENDING: "PENDING" },
};

const MAP: Record<GameKey, (d: Raw) => Raw> = {
  "win-go": (d) => ({
    period: d.winGo.period,
    interval: d.winGo.intervalMin,
    betOn: d.number ?? d.color ?? d.bigSmall,
    betAmount: d.betAmount,
    winAmount: d.winAmount,
    charge: d.charge,
    netWinAmount: d.netWinAmount,
    status: d.status,
    dateTime: humanDate(d.dateTime),
  }),
  k3: (d) => ({
    period: d.meddolic_game_k3_summary.game_id,
    interval: Number(d.meddolic_game_k3_summary.interval_min),
    betOn:
      d.number ??
      (d.big_small === 1 ? "BIG" : d.big_small === 2 ? "SMALL" : null) ??
      (d.odd_even === 1 ? "ODD" : d.odd_even === 2 ? "EVEN" : null) ??
      d.identical_2 ??
      d.different_2 ??
      d.identical_3 ??
      (d.any_identical_3 ? "ANY TRIPLE" : null) ??
      d.different_3 ??
      (d.any_consecutive_3 ? "ANY STRAIGHT" : null),
    betAmount: d.bet_amount,
    winAmount: d.win_amount,
    charge: d.charge,
    netWinAmount: d.net_win_amount,
    status: d.status === 1 ? "WIN" : d.status === 2 ? "LOSE" : "PENDING",
    dateTime: humanDate(d.date_time),
  }),
  aviator: (d) => ({
    period: d.aviator.id,
    interval: null,
    cashoutMultiplier: d.cashoutMultiplier,
    betOn: d.side,
    betAmount: d.betAmount,
    winAmount: d.winAmount,
    charge: d.tax,
    netWinAmount: d.netAmount,
    status: d.status,
    dateTime: humanDate(d.createdAt),
  }),
};

const IST_OFFSET = 5.5 * 3_600_000;

function betHistoryData() {
  Alpine.data("betHistoryData", () => ({
    game: "win-go" as GameKey,
    status: "All",
    date: new Date(Date.now() + IST_OFFSET).toISOString().split("T")[0]!,
    bets: [] as Raw[],
    currentPage: 0,
    totalPages: 0,
    page: 1,
    requestId: 0,

    init() {
      void this.fetchPage(1);
      this.$watch("date", () => this.refreshHistory());
    },
    async fetchPage(page: number) {
      const loader = document.getElementById("loadingloader");
      if (loader) {
        loader.style.display = "block";
      }
      const mine = ++this.requestId;
      const game = this.game;
      try {
        const params = new URLSearchParams({ page: String(page), limit: "10" });
        if (this.date) {
          const from = new Date(new Date(this.date).getTime() + IST_OFFSET).toISOString().split("T")[0]!;
          params.set("from", from);
          params.set("to", from);
        }
        if (this.status !== "All") {
          params.set("status", STATUS_FOR_GAME[game][this.status.toUpperCase()]!);
        }
        const data = await api<{ data: Raw[]; totalPages: number; currentPage: number }>(`/${game}/bet-history?${params}`);
        // A reply for a tab the user has since left must not overwrite the active tab.
        if (mine !== this.requestId || game !== this.game) {
          return;
        }
        this.page = page;
        this.bets = data.data.map(MAP[game]);
        this.currentPage = data.totalPages === 0 ? 0 : data.currentPage;
        this.totalPages = data.totalPages;
      } finally {
        if (loader) {
          loader.style.display = "none";
        }
      }
    },
    prev() {
      if (this.page > 1) {
        void this.fetchPage(this.page - 1);
      }
    },
    next() {
      if (this.page < this.totalPages) {
        void this.fetchPage(this.page + 1);
      }
    },
    changeGame(value: GameKey) {
      this.game = value;
      this.bets = [];
      this.currentPage = 0;
      this.totalPages = 0;
      this.changeStatus("All");
    },
    changeStatus(value: string) {
      this.status = value;
      this.refreshHistory();
    },
    refreshHistory() {
      void this.fetchPage(1);
    },
  }));
}

export function BetReport() {
  return <AlpinePage html={betHtml} legacy={betCss} setup={betHistoryData} />;
}
