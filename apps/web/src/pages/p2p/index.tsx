import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Router, Switch, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import { HeaderNav } from "@/components/header-nav";
import { Shell } from "@/components/shell";
import { queryClient } from "@/lib/query-client";
import { navigate } from "@/utils/navigation";

import { HistoryView } from "./history-view";
import { Instructions } from "./instructions";
import { TransferForm } from "./transfer-form";
import { WalletCard } from "./wallet-card";

function P2PHeader() {
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
      title={isHistory ? "P2P History" : "P2P Transfer"}
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

function MainP2PView() {
  return (
    <main className="px-4 pb-8 space-y-4">
      <WalletCard />
      <TransferForm />
      <Instructions />
    </main>
  );
}

export default function P2P() {
  return (
    <Router hook={useHashLocation}>
      <Shell>
        <P2PHeader />
        <Switch>
          <Route path="/history">{() => <HistoryView />}</Route>
          <Route>{() => <MainP2PView />}</Route>
        </Switch>
      </Shell>
    </Router>
  );
}

