import { useSignals } from "@/lib/signal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import { HeaderNav } from "@/components/header-nav";
import { Shell } from "@/components/shell";
import { queryClient } from "@/lib/query-client";
import { navigate } from "@/utils/navigation";

import { activeTab } from "./config";
import { HistoryView } from "./history-view";
import { Instructions } from "./instructions";
import { OfflineTab } from "./offline-tab";
import { OnlineTab } from "./online-tab";
import { Tabs } from "./tabs";
import { WalletCard } from "./wallet-card";

function RechargeHeader() {
  const [location, setLocation] = useLocation();

  const handleBack = () => {
    if (location === "/" || location === "") {
      navigate("/account");
    } else {
      setLocation("/");
    }
  };

  const isHistory = location === "/history";

  return (
    <HeaderNav
      title={isHistory ? "Deposit history" : "Deposit"}
      onBack={handleBack}
      rightSlot={
        isHistory ? null : (
          <button
            type="button"
            onClick={() => setLocation("/history")}
            className="text-xs font-semibold text-brand-gold hover:text-brand-gold-light transition-colors cursor-pointer border-0 bg-transparent"
          >
            Deposit history
          </button>
        )
      }
    />
  );
}

function MainDepositView() {
  useSignals();
  return (
    <main className="px-4 pb-8 space-y-4">
      <WalletCard />
      <Tabs />
      {activeTab.value === "UPI" ? <OfflineTab /> : <OnlineTab />}
      <Instructions />
    </main>
  );
}

export default function Recharge() {
  return (
    <Router hook={useHashLocation}>
      <Shell>
        <RechargeHeader />
        <Switch>
          <Route path="/history">{() => <HistoryView />}</Route>
          <Route>{() => <MainDepositView />}</Route>
        </Switch>
      </Shell>
    </Router>
  );
}

