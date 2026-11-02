import type { ReactNode } from "react";

function RuleCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-surface-card rounded-2xl mb-4 overflow-hidden shadow-md border border-border-card/50">
      <div className="flex items-center bg-surface-card-header py-3 px-4">
        <span className="text-base mr-2">{icon}</span>
        <h3 className="m-0 text-sm text-white font-bold">{title}</h3>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-accent-teal mt-0.5 text-xs">▶</span>
      <div className="text-text-gold text-xs leading-relaxed font-medium">
        {children}
      </div>
    </div>
  );
}

function InfoBox({
  title,
  titleColor = "var(--color-text-muted)",
  children,
}: {
  title?: string;
  titleColor?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-surface-input border border-border-card rounded-xl p-3.5 mt-2">
      {title && (
        <div style={{ color: titleColor }} className="mb-1 text-xs font-bold">
          {title}
        </div>
      )}
      <div className="text-text-muted text-xs leading-relaxed">{children}</div>
    </div>
  );
}

export function LearnView() {
  return (
    <div className="px-4 pb-8 bg-bg-page text-white font-sans">
      {/* Badge */}
      <div className="flex justify-center mb-4 pt-3">
        <div className="bg-surface-badge text-accent-salmon py-1.5 px-4 rounded-full text-xs font-semibold border border-border-badge">
          Minimum return, daily interest 1%
        </div>
      </div>

      <RuleCard title="Income" icon="💰">
        <Bullet>
          The Income Calculation Method Is the Base Interest Rate Plus the Vip
          Level Extra Interest Rate;
        </Bullet>
        <Bullet>
          After the balance is transferred in, profit will be calculated once
          every 24 Hours
        </Bullet>
        <Bullet>
          Profit will be paid on the 2nd transfer or transfer out and the
          previous profit will be transferred to the wallet balance
        </Bullet>
      </RuleCard>

      <RuleCard title="Transfer In" icon="💲«">
        <Bullet>
          Wallet balance transferred to the safe must be transferred in points
        </Bullet>
        <InfoBox title="For example">
          1 point is 1000, transfer in 2 points is 2000, 10 points is 10000, 50
          points is 50000, transfer amount must be a multiple of 1000
        </InfoBox>
      </RuleCard>

      <RuleCard title="Transfer Out" icon="💲»">
        <Bullet>
          Provided your income is guaranteed, you can transfer out at any time,
          from the balance of the safe to the balance of the wallet and the
          amount transferred must be a multiple of the number of copies
        </Bullet>
        <InfoBox title="Reminder" titleColor="#f85c5c">
          Please do not transfer in and out frequently. Earnings will be
          calculated from 24 hours after deposit. If the cumulative amount of an
          earned amount is less than 0.01, the amount will not be counted in
          "earnings".
        </InfoBox>
      </RuleCard>
    </div>
  );
}
