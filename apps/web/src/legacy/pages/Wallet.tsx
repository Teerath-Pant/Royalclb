/* Generated from User/wallet.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, formatAmount, important } from "../php";
import inlineCss from "./css/Wallet.css?raw";

const DEFAULTS: Record<string, any> = {
  "financialServices": [
    {
      "title": "New Deposit",
      "sub": "Send Deposit Request",
      "icon": "/User/assets/png/transation.png",
      "link": "/recharge"
    },
    {
      "title": "New Withdrawal",
      "sub": "Send Withdrawal Request",
      "icon": "/User/assets/png/transation.png",
      "link": "/withdrawal"
    },
    {
      "title": "Deposit Amount",
      "sub": "My Deposit History",
      "icon": "/User/assets/png/deposit-icon.png",
      "link": "./rechargeHistory.php"
    },
    {
      "title": "Deposit Amount (Online)",
      "sub": "My Deposit History (Online)",
      "icon": "/User/assets/png/deposit-icon.png",
      "link": "./recharge_history_online.php"
    },
    {
      "title": "Withdrawal",
      "sub": "My Withdraw History",
      "icon": "/User/assets/png/withdrawal.png",
      "link": "./withdrawal_history.php"
    },
    {
      "title": "All Bet",
      "sub": "All Bet Win/Lose History",
      "icon": "/User/assets/png/deposit-icon.png",
      "link": "/bet-report"
    },
    {
      "title": "1st & 2nd Deposit Bonus",
      "sub": "1st & 2nd Deposit Bonus History",
      "icon": "/User/assets/png/deposit-icon.png",
      "link": "/income/deposit-bonus-1-2"
    },
    {
      "title": "3rd, 4th & 5th Deposit Bonus",
      "sub": "3rd, 4th & 5th Deposit Bonus History",
      "icon": "/User/assets/png/deposit-icon.png",
      "link": "/income/deposit-bonus-3-4-5"
    },
    {
      "title": "Daily Deposit Bonus",
      "sub": "Daily Deposit Bonus History",
      "icon": "/User/assets/png/deposit-icon.png",
      "link": "/income/daily-recharge"
    },
    {
      "title": "USDT Deposit Bonus",
      "sub": "USDT Deposit Bonus History",
      "icon": "/User/assets/svg/usdt-tether.svg",
      "link": "/income/usd-deposit-bonus"
    },
    {
      "title": "Daily Attendance Bonus",
      "sub": "Daily Attendance Bonus History",
      "icon": "/User/assets/png/deposit-icon.png",
      "link": "/attendance"
    },
    {
      "title": "Bet Commission",
      "sub": "Bet Commission History",
      "icon": "/User/assets/png/deposit-icon.png",
      "link": "/income/level"
    },
    {
      "title": "Daily Rebate Income",
      "sub": "Daily Rebate Income History",
      "icon": "/User/assets/png/deposit-icon.png",
      "link": "/income/daily-rebate"
    },
    {
      "title": "Debit Credit history",
      "sub": "Debit Credit history",
      "icon": "/User/assets/png/withdrawal.png",
      "link": "/wallet-statement"
    }
  ]
};

export const legacy = {
  stylesheets: [
  "/User/assets/css/modules-13a75a76.css",
  "/User/assets/css/page-activity-edd5885d.css",
  "/User/assets/css/page-home-4a55d8dd.css",
  "/User/assets/css/index-053c656b.css",
  "/User/assets/css/reset-7514927e.css",
  "/User/assets/css/page-login-3c8cfc52.css",
  "/User/assets/css/page-test-e4c78870.css",
  "/User/assets/css/page-main-f7a20b18.css",
  "/User/assets/css/page-promotion-3f871a88.css",
  "/User/assets/css/page-wallet-d7e3e5ae.css"
],
  inlineCss,
  tailwind: false,
  htmlStyle: "font-size:36px;",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function WalletView(props: Record<string, any>) {
  const { currentPage, financialServices = DEFAULTS.financialServices, summaryCards, totalWallet } = props;
  
  return (
    <>
      {" "}<div id="app" data-v-app="">{" "}<div data-v-4ccf0bf4="" className="wallet-container" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.back()} />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-2f448113="" className="navbar__content-title" style={{ color: "#FDE4BC" } as CSS}>{"Wallet Management"}</div>{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.forward()} />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-4ccf0bf4="" className="wallet-container-header">{" "}<div data-v-4ccf0bf4="" className="wallet-container-header-belly" style={{ cursor: "pointer" } as CSS} onClick={() => go("/wallet-details")}>{" "}<img data-v-4ccf0bf4="" src="/User/assets/png/wallets-55b46543.png" alt="Wallet" />{" "}<div data-v-4ccf0bf4="">{"₹"}{totalWallet}</div>{" "}<span data-v-4ccf0bf4="">{"Total balance"}</span>{" "}</div>{" "}</div>{" "}<div data-v-4ccf0bf4="" className="wallet-container-content">{" "}<div data-v-4ccf0bf4="" className="container">{" "}<div data-v-4ccf0bf4="" className="recycleBtnD">{" "}<button data-v-4ccf0bf4="" className="recycleBtn">{"ALL INCOME & DEPOSIT REPORT"}</button>{" "}</div>{" "}<div data-v-7913842b="" data-v-63f9c5de="" className="financialServices__container">{" "}<div data-v-7913842b="" className="financialServices__container-box">{" "}{financialServices.map((service: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-7913842b="" className="backgrd">{" "}<img data-v-7913842b="" src={service?.icon} alt={service?.title} />{" "}<div data-v-7913842b="" className="financialServices__container-box-para backgrd" onClick={() => go(service?.link)}>{" "}<h3 data-v-7913842b="" className="text11">{service?.title}</h3>{" "}<span data-v-7913842b="" className="text22">{service?.sub}</span>{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}</div>{" "}</div>{" "}<div ref={important("margin-top:0.5rem !important")}>{" "}<div data-v-4ccf0bf4="" className="gameList" ref={important("padding-bottom:10px !important")}>{" "}{summaryCards.map((card: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-4ccf0bf4="" className="box box2">{" "}<div data-v-4ccf0bf4="" className="imgD"><img data-v-4ccf0bf4="" src="/User/assets/png/luck_bg-62bc96e0.png" style={{ width: "80%" } as CSS} alt="" /></div>{" "}<h3 data-v-4ccf0bf4="" className="money textfont11">{"₹"}{formatAmount(card?.amount)}</h3>{" "}<span data-v-4ccf0bf4="" className="textfont1">{card?.title}</span>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}
    </>
  );
}
