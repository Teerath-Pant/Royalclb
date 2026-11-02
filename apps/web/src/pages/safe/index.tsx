import { QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";

import { HeaderNav } from "@/components/header-nav";
import { Shell } from "@/components/shell";
import { queryClient } from "@/lib/query-client";
import { navigate } from "@/utils/navigation";

import { LearnView } from "./learn-view";
import { MainView } from "./main-view";
import { Toast } from "./toast";
import { TransferInModal } from "./transfer-in-modal";
import { TransferOutModal } from "./transfer-out-modal";

function SafeHeader() {
  const [location, setLocation] = useLocation();

  const handleBack = () => {
    if (location === "/" || location === "") {
      navigate("/account");
    } else {
      setLocation("/");
    }
  };

  const title = location === "/learn" ? "Learn about safes" : "Safe";

  return <HeaderNav title={title} onBack={handleBack} />;
}

export default function Safe() {
  return (
    <Router hook={useHashLocation}>
      <Shell>
        <SafeHeader />
        <main>
          <Switch>
            <Route path="/learn">{() => <LearnView />}</Route>
            <Route>
              {() => (
                <>
                  <MainView />
                  <TransferInModal />
                  <TransferOutModal />
                </>
              )}
            </Route>
          </Switch>
        </main>
        <Toast />
      </Shell>
    </Router>
  );
}

