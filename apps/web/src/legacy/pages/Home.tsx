/* Generated from User/home.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, APP_NAME, LOGO, formatAmount, number_format } from "../php";
import inlineCss from "./css/Home.css?raw";

const DEFAULTS: Record<string, any> = {
  "gameCategories": [
    {
      "title": "Wingo",
      "image": "/User/images/gamecategory_20231215033613klhe.png",
      "link": "../WINGO"
    },
    {
      "title": "Aviator",
      "image": "/User/images/gamecategory_2023121503353389nc.png",
      "link": "../aviator"
    },
    {
      "title": "K3",
      "image": "/User/images/k3.png",
      "link": "/k3"
    },
    {
      "title": "Dragon vs Tiger",
      "image": "/User/images/dragon-tiger.png",
      "link": "/dragon-tiger"
    },
    {
      "title": "Animal Roulette",
      "image": "/User/images/animal-roulette.png",
      "link": "/animal"
    },
    {
      "title": "Coming Soon",
      "image": "/User/images/SMG_wildfireWins.png",
      "link": "#"
    }
  ],
  "popularGames": [
    {
      "image": "/User/images/19.png",
      "odds": "84.96%"
    },
    {
      "image": "/User/images/AT05.png",
      "odds": "88.02%"
    },
    {
      "image": "/User/images/SMG_10000Wishes.png",
      "odds": "91.24%"
    },
    {
      "image": "/User/images/SMG_wildfireWins.png",
      "odds": "85.46%"
    },
    {
      "image": "/User/images/213.png",
      "odds": "88.36%"
    },
    {
      "image": "/User/images/707.png",
      "odds": "85.09%"
    },
    {
      "image": "/User/images/AT01.png",
      "odds": "93.49%"
    },
    {
      "image": "/User/images/66.png",
      "odds": "91.98%"
    },
    {
      "image": "/User/images/208.png",
      "odds": "81.24%"
    },
    {
      "image": "/User/images/AB3.png",
      "odds": "81.47%"
    },
    {
      "image": "/User/images/grandwheel000000.png",
      "odds": "91.92%"
    },
    {
      "image": "/User/images/777strike0000000.png",
      "odds": "87.99%"
    },
    {
      "image": "/User/images/EP03_EN.png",
      "odds": "91.57%"
    },
    {
      "image": "/User/images/7001.png",
      "odds": "89.34%"
    },
    {
      "image": "/User/images/7002.png",
      "odds": "82.89%"
    },
    {
      "image": "/User/images/910.png",
      "odds": "88.35%"
    },
    {
      "image": "/User/images/SMG_777RoyalWheel.png",
      "odds": "86.33%"
    },
    {
      "image": "/User/images/563.png",
      "odds": "90.76%"
    }
  ],
  "initialWinners": [
    {
      "game": "/User/images/gamecategory_20231215033613klhe.png",
      "avatar": "/User/images/2-58c8a9bc.png",
      "user": "Mem***CRL",
      "amount": 1136.0
    },
    {
      "game": "/User/images/gamecategory_20231215033613klhe.png",
      "avatar": "/User/images/6-7c7f5203.png",
      "user": "Mem***BRV",
      "amount": 290.0
    },
    {
      "game": "/User/images/chickenroad.png",
      "avatar": "/User/images/12-ae12c679.png",
      "user": "Mem***YHZ",
      "amount": 18.82
    },
    {
      "game": "/User/images/gamecategory_2023121503353389nc.png",
      "avatar": "/User/images/19-2ac9fd83.png",
      "user": "Mem***DCP",
      "amount": 33.0
    },
    {
      "game": "/User/images/gamecategory_2023121503353389nc.png",
      "avatar": "/User/images/11-925c456e.png",
      "user": "Mem***BMS",
      "amount": 80.0
    },
    {
      "game": "/User/images/gamecategory_2023121503353389nc.png",
      "avatar": "/User/images/6-7c7f5203.png",
      "user": "Mem***OYL",
      "amount": 240.0
    }
  ]
};

export const legacy = {
  stylesheets: [
  "/User/assets/css/modules-b642e9bc.css",
  "/User/assets/css/page-activity-e94516d2.css",
  "/User/assets/css/index-37a2335c.css",
  "/User/assets/css/page-home-3889ef4f.css",
  "/User/assets/css/page-login-7527a426.css",
  "/User/assets/css/page-main-5a34fc00.css",
  "/User/assets/css/page-promotion-f2e15757.css",
  "/User/assets/css/page-test-24de9c20.css",
  "/User/assets/css/page-wallet-53f06c34.css",
  "/User/assets/css/page-vip-896cf332.css",
  "/User/assets/css/modules-13a75a76.css",
  "/User/assets/css/page-activity-edd5885d.css",
  "/User/assets/css/page-home-4a55d8dd.css",
  "/User/assets/css/index-053c656b.css",
  "/User/assets/css/reset-7514927e.css",
  "/User/css/swiper-bundle.min.css",
  "/User/css/mycss.css"
],
  inlineCss,
  tailwind: true,
  htmlStyle: "font-size:36px;",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function HomeView(props: Record<string, any>) {
  const { approvedRechargeCount, banners, currentPage, firstDepositTiers, gameCategories = DEFAULTS.gameCategories, initialWinners = DEFAULTS.initialWinners, miscConfig, newsConfig, popularGames = DEFAULTS.popularGames, telegramLink, totalWallet, usdToInrRate, walletBalance } = props;
  
  return (
    <>
      {" "}{/* PHP: _Init() */}{" "}<div id="app" data-v-app="">{" "}<div className="custom-header">{" "}<div className="logo">{" "}<img src={LOGO} alt={APP_NAME} style={{ height: "50px" } as CSS} />{" "}</div>{" "}<div className="actions">{" "}<div className="action-btn">{" "}<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f7a01a" strokeWidth="2">{" "}<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />{" "}</svg>{" "}</div>{" "}<div className="action-btn">{" "}<img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="EN" style={{ height: "16px" } as CSS} />{" EN "}</div>{" "}</div>{" "}</div>{" "}<div className="main-slider">{" "}<div className="swiper-container" style={{ overflowX: "hidden" } as CSS}>{" "}<div className="swiper-wrapper">{" "}{(Boolean(banners)) ? (<>{" "}{banners.map((banner: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div className="swiper-slide">{" "}<img src={`../${banner?.paymentImage}`} style={{ width: "100%", height: "100%", objectFit: "cover" } as CSS} alt="Banner" />{" "}</div>{" "}</Fragment>); })}{" "}</>) : (<>{" "}<div className="swiper-slide" style={{ background: "linear-gradient(to right, #0a9900, #a0d810)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" } as CSS}>{" "}<h1 style={{ fontSize: "40px", margin: "0", textAlign: "center" } as CSS}>{" "}</h1>{" "}</div>{" "}</>)}{" "}</div>{" "}<div className="swiper-pagination" />{" "}</div>{" "}</div>{" "}{(Boolean(newsConfig) && Number(newsConfig?.newStatus) === 1) ? (<>{" "}<div className="notice-marquee">{" "}<div className="icon">{"📢"}</div>{" "}<div className="text">{" "}<marquee behavior="scroll" direction="left" scrollamount="4">{" "}{newsConfig?.news}{" "}</marquee>{" "}</div>{" "}<button className="detail-btn">{"Detail"}</button>{" "}</div>{" "}</>) : null}{" "}<div className="wallet-section">{" "}<div className="wallet-balance-row">{" "}<div style={{ width: "160px", display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" } as CSS}>{" "}<div className="wallet-header">{" "}<span style={{ display: "flex", alignItems: "center", gap: "5px" } as CSS}>{" "}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{" "}<path d="M22 12V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2" />{" "}<path d="M22 12h-4a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h4" />{" "}<path d="M22 16h-4a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4" />{" "}</svg>{" Wallet balance "}</span>{" "}</div>{" "}<div className="wallet-amount" id="wallet-balance">{walletBalance}</div>{" "}</div>{" "}<div className="wallet-actions">{" "}<button className="btn-action btn-withdraw" onClick={() => go("/withdrawal")}>{" "}<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="3">{" "}<path d="M12 19V5M5 12l7-7 7 7" />{" "}</svg>{" Withdraw "}</button>{" "}<button className="btn-action btn-deposit" onClick={() => go("/recharge")}>{" "}<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="3">{" "}<path d="M12 5v14M5 12l7 7 7-7" />{" "}</svg>{" Deposit "}</button>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-045c911a="" data-v-43d073d6="" className="home_container">{" "}<div data-v-44261ece="" data-v-045c911a="" className="hot_container">{" "}<div data-v-44261ece="" className="popular">{" "}<div data-v-44261ece="" className="list">{" "}{gameCategories.map((game: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-44261ece="" onClick={() => go(game?.link)}>{" "}<div data-v-44261ece="" className="item">{" "}<img data-v-44261ece="" src={game?.image} alt={game?.title} />{" "}</div>{" "}<div data-v-44261ece="" className="games-label">{" "}{game?.title}{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-045c911a="" data-v-43d073d6="" className="home_container">{" "}<div className="winning-info-header">{" "}<div className="title-bar" />{" "}<h3>{"Popular"}</h3>{" "}</div>{" "}<div data-v-44261ece="" data-v-045c911a="" className="hot_container">{" "}<div data-v-44261ece="" className="popular">{" "}<div data-v-44261ece="" className="list">{" "}{popularGames.map((popular: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-44261ece="">{" "}<div data-v-44261ece="" className="item">{" "}<img data-v-44261ece="" src={popular?.image} alt="Game" />{" "}</div>{" "}<div data-v-44261ece="" className="win-odds">{" "}<span data-v-44261ece="">{"odds of winning"}</span>{" "}<span data-v-44261ece="">{popular?.odds}</span>{" "}<div data-v-44261ece="" className="win-p" style={{ width: popular?.odds } as CSS} />{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div className="winning-info-container">{" "}<div className="winning-info-header">{" "}<div className="title-bar" />{" "}<h3>{"Winning information"}</h3>{" "}</div>{" "}<div className="winning-info-list">{" "}{initialWinners.map((winner: any, _i: number) => { let inrAmount: any = Number(winner?.amount); let usdtAmount: any = inrAmount / usdToInrRate; let displayAmount: any = '₹' + number_format(inrAmount, 2) + ' / ' + number_format(usdtAmount, 2) + ' USDT'; return (<Fragment key={_i}>{" "}<div className="winner-item">{" "}<div className="winner-game">{" "}<img src={winner?.game} alt="Game" />{" "}</div>{" "}<div className="winner-details">{" "}<div className="winner-user">{" "}<img src={winner?.avatar} className="winner-avatar" alt="Avatar" />{" "}<span className="winner-name">{winner?.user}</span>{" "}</div>{" "}<div className="winner-amount">{" "}<span className="text-gray">{"Winning amount"}</span>{" "}<span className="text-gold">{displayAmount}</span>{" "}</div>{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}</div>{" "}<div className="floating-icons">{" "}<div onClick={() => go(telegramLink)}>{" "}<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" style={{ background: "#0088cc", borderRadius: "50%", padding: "5px", width: "40px", height: "40px" } as CSS}>{" "}<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />{" "}</svg>{" "}</div>{" "}<div onClick={() => go("/support")}>{" "}<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f7a01a" strokeWidth="2" style={{ background: "#fff", borderRadius: "50%", padding: "5px", width: "40px", height: "40px" } as CSS}>{" "}<circle cx="12" cy="12" r="10" />{" "}<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />{" "}</svg>{" "}</div>{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}</div>{" "}{(approvedRechargeCount < 1) ? (<>{" "}<div className="van-overlay home-first-deposit-overlay" id="homeFirstDepositOverlay" />{" "}<div role="dialog" aria-modal="true" aria-labelledby="homeFirstDepositTitle" className="van-popup van-popup--center van-dialog home-first-deposit-dialog" id="homeFirstDepositDialog">{" "}<div className="van-dialog__header">{" "}<div className="home-deposit-header">{" "}<div className="home-deposit-title" id="homeFirstDepositTitle">{"Extra first deposit bonus"}</div>{" "}<div className="home-deposit-tip">{"Each account can only receive rewards once"}</div>{" "}</div>{" "}</div>{" "}<div className="van-dialog__content">{" "}<div className="home-deposit-container">{" "}{firstDepositTiers.map((tier: any, _i: number) => { let depositRequired: any = Number(tier?.deposit); let depositProgress: any = tier?.is_eligible ? depositRequired : 0; let progressPercent: any = tier?.is_eligible ? 100 : 0; return (<Fragment key={_i}>{" "}{" "}<div className="home-deposit-item">{" "}<div className="home-deposit-head">{" "}<div className="home-deposit-name">{"First deposit "}<span>{"$"}{formatAmount(tier?.deposit)}</span></div>{" "}<div className="home-deposit-bonus">{"+ $"}{formatAmount(tier?.bonus)}</div>{" "}</div>{" "}<div className="home-deposit-description">{"Deposit $"}{formatAmount(tier?.deposit)}{" for the first time and you will receive $"}{formatAmount(tier?.bonus)}{" bonus"}</div>{" "}<div className="home-deposit-foot">{" "}<div className="home-deposit-progress"><div className="home-deposit-fill" style={{ width: `${String(progressPercent)}%` } as CSS} /><div className="home-deposit-step">{formatAmount(depositProgress)}{"/$"}{formatAmount(tier?.deposit)}</div></div>{" "}<div className="home-deposit-button" onClick={() => go("/recharge")}>{"Deposit"}</div>{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}<div className="home-deposit-close" id="homeFirstDepositClose" role="button" aria-label="Close" />{" "}</div>{" "}<div className="home-deposit-footer">{" "}<label><input type="checkbox" id="homeFirstDepositToday" />{" No more reminders today"}</label>{" "}<div className="home-deposit-activity" onClick={() => go("/first-deposit-bonus")}>{"Activity"}</div>{" "}</div>{" "}</div>{" "}</>) : null}{" "}{(Boolean(miscConfig?.dashboardImage) && Number((miscConfig?.imageStatus ?? 0)) === 1) ? (<>{" "}<div role="dialog" tabIndex={0} data-v-715dd0f6="" className="van-popup van-popup--center van-dialog" style={{ zIndex: "2001", display: "none" } as CSS} id="announcementDialog">{" "}<div className="van-dialog__content">{" "}<div data-v-715dd0f6="" className="promptHeader">{"Notification"}</div>{" "}<div data-v-715dd0f6="" className="promptContent">{" "}<center>{" "}<img src={`../${miscConfig?.dashboardImage}`} width="100%" alt="Notification" />{" "}</center>{" "}</div>{" "}<div data-v-715dd0f6="" className="promptBtn" data-todo-onclick="document.getElementById('announcementDialog').style.display=">{"Confirm"}</div>{" "}</div>{" "}<div className="van-hairline--top van-dialog__footer" />{" "}</div>{" "}</>) : null}{" "}
    </>
  );
}
