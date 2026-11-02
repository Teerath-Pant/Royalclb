/* Generated from User/first-deposit-bonus.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, formatAmount } from "../php";
import inlineCss from "./css/FirstDepositBonus.css?raw";

const DEFAULTS: Record<string, any> = {};

export const legacy = {
  stylesheets: [],
  inlineCss,
  tailwind: false,
  htmlStyle: "",
  bodyStyle: "",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function FirstDepositBonusView(props: Record<string, any>) {
  const { depositTiers, eligibleFirstDeposit, highestBonus, usdToInrRate } = props;
  
  return (
    <>
      {" "}<div className="page">{" "}<header className="navbar">{" "}<a className="back" href="/home" aria-label="Back">{"‹"}</a>{" "}<span>{"First deposit bonus"}</span>{" "}</header>{" "}<main className="list">{" "}{depositTiers.map((tier: any, _i: number) => { let depositRequired: any = Number(tier?.deposit); let isEligible: any = depositRequired === eligibleFirstDeposit; let depositProgress: any = isEligible ? depositRequired : 0; let progressPercent: any = isEligible ? 100 : 0; let displayDeposit: any = depositRequired / usdToInrRate; let displayBonus: any = Number(tier?.bonus) / usdToInrRate; return (<Fragment key={_i}>{" "}{" "}<section className="card">{" "}<div className="head">{" "}<div className="name">{"First deposit "}<span>{"$"}{formatAmount(displayDeposit)}{" USDT"}</span></div>{" "}<div className="bonus">{"+ $"}{formatAmount(displayBonus)}{" USDT"}</div>{" "}</div>{" "}<div className="description">{"Deposit $"}{formatAmount(displayDeposit)}{" USDT for the first time and you will receive $"}{formatAmount(displayBonus)}{" USDT bonus"}</div>{" "}<div className="foot">{" "}<div className="progress"><div className="progress-fill" style={{ width: `${String(progressPercent)}%` } as CSS} /><div className="step">{formatAmount(depositProgress / usdToInrRate)}{"/"}{formatAmount(displayDeposit)}{" USDT"}</div></div>{" "}<a className="deposit" href="/recharge">{"Deposit"}</a>{" "}</div>{" "}</section>{" "}</Fragment>); })}{" "}</main>{" "}<section className="rules">{" "}<div className="rules-title">{"Activity Rules"}</div>{" "}<p>{"Exclusive for the first recharge of the account. There is only one chance. The more you recharge, the more rewards you will receive. The highest reward is $"}{formatAmount(highestBonus)}{" USDT."}</p>{" "}<p>{"Activities cannot be participated in repeatedly."}</p>{" "}<p>{"Rewards can only be claimed manually on IOS, Android, H5, and PC."}</p>{" "}<p>{"The bonus (excluding the principal) given in this event requires 1 times the coding turnover (i.e. valid bets) before it can be withdrawn, and the coding does not limit the platform."}</p>{" "}<p>{"This event is limited to normal human operations by the account owner. It is prohibited to rent, use plug-ins, robots, gamble with different accounts, brush each other, arbitrage, interfaces, protocols, exploit loopholes, group control or other technical means to participate, otherwise it will be canceled or Rewards will be deducted, frozen, or even blacklisted;"}</p>{" "}<p>{"In order to avoid differences in text understanding, this platform reserves the right of final interpretation of this event."}</p>{" "}</section>{" "}</div>{" "}
    </>
  );
}
