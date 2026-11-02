import { useSignals } from "@/lib/signal";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";

import type { WithdrawalMethod } from "@/api/withdrawal-methods";
import { HeaderNav } from "@/components/header-nav";
import { Shell } from "@/components/shell";
import { queryClient } from "@/lib/query-client";
import { withdrawalMethodsQueryOptions } from "@/queries/withdrawal-methods";
import { navigate } from "@/utils/navigation";

import { activeTab } from "./config";
import { Instructions } from "./instructions";
import { MethodForm } from "./method-form";
import { MethodTabs } from "./method-tabs";
import { StatusCard } from "./status-card";

const handleBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    navigate("/settings");
  }
};

function WithdrawalMethodsView() {
  useSignals();
  const { data, isLoading } = useQuery(withdrawalMethodsQueryOptions);

  const configuredMethods: WithdrawalMethod[] = data ?? [];
  const currentTab = activeTab.value;

  const currentMethod = configuredMethods.find(
    (method) => method.type === currentTab
  );

  return (
    <Shell>
      <HeaderNav title="Withdrawal Methods" onBack={handleBack} />

      <main className="px-4 pb-8 space-y-2">
        <MethodTabs configuredMethods={configuredMethods} />

        <StatusCard method={currentMethod} isLoading={isLoading} />

        <MethodForm existingMethod={currentMethod} />

        <Instructions />
      </main>
    </Shell>
  );
}

export default function WithdrawalMethodsApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <WithdrawalMethodsView />
    </QueryClientProvider>
  );
}

