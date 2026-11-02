import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Router, Switch, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import { HeaderNav } from "@/components/header-nav";
import { Shell } from "@/components/shell";
import { queryClient } from "@/lib/query-client";
import { navigate } from "@/utils/navigation";

import { HistoryView } from "./history-view";
import { Instructions } from "./instructions";
import { Tabs } from "./tabs";
import { WalletCard } from "./wallet-card";
import { WithdrawalForm } from "./withdrawal-form";

function WithdrawalHeader() {
  const [location, setLocation] = useLocation();

  const handleBack = () => {
    if (location === "/history") {
      setLocation("/");
    } else {
      navigate("/account");
    }
  };

  const isHistory = location === "/history";

  return (
    <HeaderNav
      title={isHistory ? "Withdrawal History" : "Withdrawal"}
      onBack={handleBack}
      rightSlot={
        isHistory ? null : (
          <button
            type="button"
            onClick={() => setLocation("/history")}
            className="text-xs font-semibold text-brand-gold hover:text-brand-gold-light transition-colors cursor-pointer border-0 bg-transparent"
          >
            History
          </button>
        )
      }
    />
  );
}

function MainWithdrawalView() {
  return (
    <main className="px-4 pb-8 space-y-2">
      <WalletCard />
      <Tabs />
      <WithdrawalForm />
      <Instructions />
    </main>
  );
}

export default function WithdrawalApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router hook={useHashLocation}>
        <Shell>
          <WithdrawalHeader />
          <Switch>
            <Route path="/history">{() => <HistoryView />}</Route>
            <Route>{() => <MainWithdrawalView />}</Route>
          </Switch>
        </Shell>
      </Router>
    </QueryClientProvider>
  );
}

