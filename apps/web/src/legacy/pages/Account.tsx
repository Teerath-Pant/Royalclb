/* Generated from User/account.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, APP_NAME, important } from "../php";
import inlineCss from "./css/Account.css?raw";

const DEFAULTS: Record<string, any> = {
  "quickActions": [
    {
      "label": "Wallet",
      "icon": "/User/assets/png/wallet.png",
      "link": "/wallet"
    },
    {
      "label": "Deposit",
      "icon": "/User/assets/png/deposit.png",
      "link": "/recharge"
    },
    {
      "label": "Withdraw",
      "icon": "/User/assets/png/withdrawal.png",
      "link": "/withdrawal"
    },
    {
      "label": "P2P",
      "icon": "/User/assets/png/p2p.png",
      "link": "/p2p"
    }
  ],
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
      "link": "/recharge#/history"
    },
    {
      "title": "Deposit Amount (Online)",
      "sub": "My Deposit History (Online)",
      "icon": "/User/assets/png/deposit-icon.png",
      "link": "/recharge#/history"
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
  ],
  "serviceCenterItems": [
    {
      "label": "Settings",
      "icon": "/User/assets/png/setting.png",
      "link": "/settings"
    },
    {
      "label": "Notification",
      "icon": "/User/assets/png/notification.png",
      "link": null
    },
    {
      "label": "24/7 Customer service",
      "icon": "/User/assets/png/customer-service-icon.png",
      "link": "mailto:playroyalclubworld@gmail.com"
    },
    {
      "label": "Support Ticket",
      "icon": "/User/assets/png/feedback.png",
      "link": "/support"
    },
    {
      "label": "Beginner's Guide",
      "icon": "/User/assets/png/bigneor-guide.png",
      "link": null
    },
    {
      "label": "About us",
      "icon": "/User/assets/png/about.png",
      "link": "/about"
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
  tailwind: true,
  htmlStyle: "font-size:36px;",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function AccountView(props: Record<string, any>) {
  const { currentPage, financialServices = DEFAULTS.financialServices, quickActions = DEFAULTS.quickActions, referralCode, roiIncome, serviceCenterItems = DEFAULTS.serviceCenterItems, totalWallet, uid, userName } = props;
  
  return (
    <>
      {" "}{/* PHP: _Init() */}{" "}<div id="app" data-v-app="">{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.back()} />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-3949aac6="" className="navbar__content-title">{APP_NAME}</div>{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.forward()} />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-47200dd8="" data-v-63f9c5de="" className="userInfo__container" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-47200dd8="" className="userInfo__container-content">{" "}<div data-v-47200dd8="" className="userInfo__container-content-wrapper">{" "}<div data-v-47200dd8="" className="userInfo__container-content__avatar">{" "}<img data-v-47200dd8="" src="/User/assets/png/2-0a41a908.png" className="userAvatar" alt="User Avatar" />{" "}</div>{" "}<div data-v-47200dd8="" className="userInfo__container-content__name">{" "}<div data-v-47200dd8="" className="userInfo__container-content-nickname">{" "}<h3 data-v-47200dd8="" ref={important("font-size:13px !important;color:#FDE4BC!important")}>{"NAME :: "}{userName}</h3>{" "}</div>{" "}<div data-v-47200dd8="" className="userInfo__container-content-nickname">{" "}<h3 data-v-47200dd8="" ref={important("font-size:13px !important;color:#FDE4BC!important")}>{"USER ID :: "}{uid}</h3>{" "}</div>{" "}<div data-v-47200dd8="" className="userInfo__container-content-nickname">{" "}<h3 data-v-47200dd8="" ref={important("font-size:13px !important;color:#FDE4BC!important")}>{"REFERRAL CODE :: "}{referralCode}</h3>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-63f9c5de="" className="userinfo-content" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-f54a4a50="" data-v-63f9c5de="" className="totalSavings__container">{" "}<div data-v-f54a4a50="" className="totalSavings__container-header">{" "}<div data-v-f54a4a50="" className="totalSavings__container-header-box ar-1px-b" style={{ cursor: "pointer" } as CSS} onClick={() => go("/wallet-details")}>{" "}<div data-v-f54a4a50="" className="totalSavings__container-header__title">{" "}<span data-v-f54a4a50="">{"Total Balance"}</span>{" "}</div>{" "}<p data-v-f54a4a50="" className="totalSavings__container-header__subtitle">{" "}<span data-v-f54a4a50="">{"₹"}{totalWallet}</span>{" "}<img data-v-f54a4a50="" src="/User/assets/png/refresh.png" alt="Refresh" />{" "}</p>{" "}</div>{" "}</div>{" "}<div data-v-f54a4a50="" className="totalSavings__container-content">{" "}{quickActions.map((action: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-f54a4a50="" className="totalSavings__container-content-item" onClick={() => go(action?.link)}>{" "}<div data-v-f54a4a50="">{" "}<img data-v-f54a4a50="" src={action?.icon} alt={action?.label} />{" "}<span data-v-f54a4a50="">{action?.label}</span>{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}</div>{" "}<div onClick={() => go("/safe")} style={{ backgroundColor: "#241e22", borderRadius: "10px", padding: "15px", display: "flex", alignItems: "center", cursor: "pointer" } as CSS}>{" "}<div style={{ width: "50px", height: "50px", backgroundColor: "#ffd84d", borderRadius: "8px", display: "flex", justifyContent: "center", alignItems: "center", marginRight: "15px", flexShrink: "0", position: "relative" } as CSS}>{" "}<div style={{ width: "24px", height: "24px", backgroundColor: "#f7931a", borderRadius: "50%", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" } as CSS} />{" "}<div style={{ position: "absolute", top: "6px", left: "6px", width: "4px", height: "4px", backgroundColor: "#f7931a", borderRadius: "50%" } as CSS} />{" "}<div style={{ position: "absolute", top: "6px", right: "6px", width: "4px", height: "4px", backgroundColor: "#f7931a", borderRadius: "50%" } as CSS} />{" "}<div style={{ position: "absolute", bottom: "6px", left: "6px", width: "4px", height: "4px", backgroundColor: "#f7931a", borderRadius: "50%" } as CSS} />{" "}<div style={{ position: "absolute", bottom: "6px", right: "6px", width: "4px", height: "4px", backgroundColor: "#f7931a", borderRadius: "50%" } as CSS} />{" "}</div>{" "}<div style={{ flex: "1" } as CSS}>{" "}<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" } as CSS}>{" "}<h3 style={{ color: "#fff", fontSize: "16px", fontWeight: "bold", margin: "0" } as CSS}>{"ROI"}</h3>{" "}<div style={{ backgroundColor: "#df9838", color: "#fff", borderRadius: "15px", padding: "2px 10px", fontSize: "13px", display: "flex", alignItems: "center", fontWeight: "bold" } as CSS}>{"₹"}{roiIncome}{" "}<span style={{ marginLeft: "5px", fontWeight: "normal" } as CSS}>{">"}</span></div>{" "}</div>{" "}<p style={{ color: "#fde4bc", fontSize: "12px", margin: "0", lineHeight: "1.4" } as CSS}>{"The daily interest rate is 1%, and the income is calculated once every 24 Hour."}</p>{" "}</div>{" "}</div>{" "}<div data-v-7913842b="" data-v-63f9c5de="" className="financialServices__container">{" "}<div data-v-7913842b="" className="financialServices__container-box">{" "}{financialServices.map((service: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-7913842b="" className="backgrd">{" "}<img data-v-7913842b="" src={service?.icon} alt={service?.title} />{" "}<div data-v-7913842b="" className="financialServices__container-box-para backgrd" onClick={() => go(service?.link)}>{" "}<h3 data-v-7913842b="" className="text11">{service?.title}</h3>{" "}<span data-v-7913842b="" className="text22">{service?.sub}</span>{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}</div>{" "}<div data-v-55719356="" data-v-63f9c5de="" className="serviceCenter-wrap">{" "}<div data-v-55719356="" className="serviceCenter__container">{" "}<h1 data-v-55719356="">{"Service center"}</h1>{" "}<div data-v-55719356="" className="serviceCenter__container-items">{" "}{serviceCenterItems.map((item: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-55719356="" className="serviceCenter__container-items__item" onClick={item?.link ? () => go(item.link) : undefined}>{" "}<img data-v-55719356="" data-origin={item?.icon} src={item?.icon} alt={item?.label} />{" "}<span data-v-55719356="">{item?.label}</span>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}</div>{" "}<div data-v-55719356="" className="serviceCenter-wrap-header">{" "}<button data-v-55719356="" data-todo-onclick="logoutaction(1);">{" "}<img data-v-55719356="" data-origin="assets/png/logout.png" src="/User/assets/png/logout.png" alt="Logout" />{" Log out "}</button>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-9f348ae7="" data-v-55719356="" id="loginaction" className="dialog inactive">{" "}<div data-v-9f348ae7="" className="dialog__container" role="dialog" tabIndex={0} style={{ backgroundColor: "#241e22", borderRadius: "20px", padding: "25px", width: "320px", maxWidth: "90%" } as CSS}>{" "}<div data-v-9f348ae7="" className="dialog__container-img" style={{ marginBottom: "20px" } as CSS}>{" "}<svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">{" "}<circle cx="12" cy="12" r="11" fill="#fa5b5b" />{" "}<path d="M11 7h2v6h-2zM11 15h2v2h-2z" fill="#fff" />{" "}</svg>{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__container-title">{" "}<h1 data-v-9f348ae7="" style={{ color: "#fde4bc", fontSize: "18px", fontWeight: "bold", marginBottom: "25px" } as CSS}>{"Do you want to log out?"}</h1>{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__container-content" />{" "}<div data-v-9f348ae7="" className="dialog__container-footer" style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" } as CSS}>{" "}<button data-v-9f348ae7="" id="logoutButton" style={{ width: "100%", padding: "12px", borderRadius: "25px", background: "linear-gradient(180deg, #ffd166, #f9a826)", color: "#111", fontWeight: "bold", border: "none", fontSize: "16px" } as CSS}>{"Confirm"}</button>{" "}<button data-v-9f348ae7="" data-todo-onclick="logoutaction(3);" style={{ width: "100%", padding: "12px", borderRadius: "25px", background: "transparent", color: "#fde4bc", fontWeight: "bold", border: "1px solid #fde4bc", fontSize: "16px" } as CSS}>{"Cancel"}</button>{" "}</div>{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__outside" data-todo-onclick="logoutaction(3);" style={{ background: "rgba(0,0,0,0.7)" } as CSS} />{" "}</div>{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}
    </>
  );
}
