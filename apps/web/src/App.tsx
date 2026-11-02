import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import type { ComponentType, ReactNode } from "react";
import { Redirect, Route, Switch } from "wouter";

import { Tailwind } from "@/components/tailwind";
import { ApiError } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { profileQuery } from "@/queries/profile";

/** Lazy-loads one named export, so each area of the panel is its own chunk. */
function page<M extends Record<string, unknown>>(load: () => Promise<M>, name: keyof M) {
  return lazy(async () => ({ default: (await load())[name] as ComponentType }));
}

const authScreens = () => import("@/legacy/auth");
const pay = () => import("@/legacy/pay");
const alpinePages = () => import("@/legacy/alpine-pages");

/** Public pages are legacy pages too, so they bring their own CSS and no Tailwind wrapper. */
const PUBLIC_ROUTES = {
  "/login": page(authScreens, "Login"),
  "/register": page(alpinePages, "Register"),
  "/forgot-password": page(authScreens, "ForgotPassword"),
};

const screens = () => import("@/legacy/screens");

/** Pages rebuilt from the PHP markup and its original CSS. They load no Tailwind. */
const LEGACY_ROUTES = {
  "/about": page(screens, "About"),
  "/activity": page(screens, "Activity"),
  "/settings": page(screens, "Settings"),
  "/vip": page(screens, "Vip"),
  "/dragon-tiger": page(() => import("@/games/dragon-tiger"), "DragonTiger"),
  "/bet-report": page(alpinePages, "BetReport"),
  "/support": page(screens, "Support"),
  "/upi-pay": page(pay, "UpiPay"),
  "/usdt-pay": page(pay, "UsdtPay"),
  "/pay-online": page(pay, "PayOnline"),
  "/gift-redeem": page(screens, "GiftRedeemScreen"),
  "/team-report": page(screens, "TeamReport"),
  "/commission": page(screens, "ViewCommission"),
  "/attendance": page(screens, "Attendance"),
  "/account": page(screens, "Account"),
  "/profile": page(screens, "Profile"),
  "/change-password": page(screens, "ChangePassword"),
  "/home": page(screens, "Home"),
  "/wallet": page(screens, "Wallet"),
  "/promotion": page(screens, "Promotion"),
  "/first-deposit-bonus": page(screens, "FirstDepositBonus"),
  "/direct": page(screens, "Direct"),
  "/team": page(screens, "Team"),
  "/new-registrations": page(screens, "NewRegistration"),
  "/wallet-statement": page(screens, "WalletStatement"),
  "/income/daily-rebate": page(screens, "DailyRebate"),
  "/income/daily-recharge": page(screens, "DailyRecharge"),
  "/income/daily-fund-roi": page(screens, "DailyFundRoi"),
  "/income/deposit-bonus": page(screens, "DepositBonus"),
  "/income/deposit-bonus-1-2": page(screens, "DepositBonus12"),
  "/income/deposit-bonus-3-4-5": page(screens, "DepositBonus345"),
  "/income/usd-deposit-bonus": page(screens, "UsdDepositBonus"),
  "/income/level": page(screens, "LevelIncome"),
  "/income/referral": page(screens, "ReferralBonus"),
  "/income/referral-level": page(screens, "ReferralLevelBonus"),
  "/income/rescue": page(screens, "RescueBonus"),
  "/income/salary": page(screens, "SalaryIncome"),
  "/income/winning-streak": page(screens, "WinningStreakIncome"),
};

const PROTECTED_ROUTES = {
  "/wallet-details": page(() => import("@/pages/wallet-details"), "default"),
  "/recharge": page(() => import("@/pages/recharge"), "default"),
  "/withdrawal": page(() => import("@/pages/withdrawal"), "default"),
  "/withdrawal-methods": page(() => import("@/pages/withdrawal-methods"), "default"),
  "/safe": page(() => import("@/pages/safe"), "default"),
  "/p2p": page(() => import("@/pages/p2p"), "default"),
};

function RequireLogin({ children }: { children: ReactNode }) {
  const { error, isPending } = useQuery(profileQuery);

  if (error instanceof ApiError && error.status === 401) {
    return <Redirect to="/login" replace />;
  }
  return isPending ? null : children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={null}>
        <Switch>
          <Route path="/">
            <Redirect to="/home" replace />
          </Route>
          {Object.entries(PUBLIC_ROUTES).map(([path, Component]) => (
            <Route key={path} path={path}>
              <Component />
            </Route>
          ))}
          {Object.entries(LEGACY_ROUTES).map(([path, Component]) => (
            <Route key={path} path={path}>
              <RequireLogin>
                <Component />
              </RequireLogin>
            </Route>
          ))}
          {Object.entries(PROTECTED_ROUTES).map(([path, Component]) => (
            <Route key={path} path={path}>
              <RequireLogin>
                <Tailwind>
                  <Component />
                </Tailwind>
              </RequireLogin>
            </Route>
          ))}
          <Route>
            <Redirect to="/home" replace />
          </Route>
        </Switch>
      </Suspense>
    </QueryClientProvider>
  );
}
