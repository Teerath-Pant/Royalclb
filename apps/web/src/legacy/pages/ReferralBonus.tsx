/* Generated from User/referral_bonus.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, date, important, strtotime } from "../php";
import inlineCss from "./css/ReferralBonus.css?raw";

const DEFAULTS: Record<string, any> = {};

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
  htmlStyle: "font-size:40px;",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function ReferralBonusView(props: Record<string, any>) {
  const { currentPage, querySalaryBonus } = props;
  
  return (
    <>
      {" "}<div id="app" data-v-app="">{" "}<div data-v-94f2e2ba="" className="ar-loading-view" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS} id="loadingloader">{" "}<div data-v-94f2e2ba="" className="loading-wrapper">{" "}<div data-v-94f2e2ba="" className="loading-animat">{" "}<div className="loading-container" id="loadingloader">{" "}<div className="loading" />{" "}<div id="loading-text" style={{ padding: "0px", margin: "0px", paddingTop: "8px", paddingLeft: "5px" } as CSS}><img src="/User/assets/png/loader.png" style={{ height: "80px" } as CSS} /></div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-8407e8ef="" className="rechargeh__container" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "#0000) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div onClick={() => go("/home")} data-v-3949aac6="" className="backIcon" id="backbuttom" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-3949aac6="" className="headLogo" ref={important("background-image:url(assets/jpg/mgg3.png) !important")} />{" "}<div data-v-3949aac6="" className="navbar__content-title" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div onClick={() => window.history.forward()} data-v-3949aac6="" className="backIcon" id="backbuttom2" />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-8ccc2c7e="" className="content" ref={important("margin-bottom:0rem !important;padding-bottom: 0rem !important")} style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-8ccc2c7e="" className="shareBtnContainer" ref={important("margin-bottom:0rem !important;padding:0px !important")}>{" "}<button data-v-8ccc2c7e="" className="shareBtn btn copyBtn">{"REFERRAL BONUS REPORT"}</button>{" "}</div>{" "}</div>{" "}<div data-v-d87f1a64="" data-v-8407e8ef="" className="infiniteScroll" id="refresh294e717922c845fc93e956259592f9c4">{" "}<input type="hidden" id="userid" name="userid" defaultValue="1" />{" "}<div id="result_report">{" "}<div data-v-8407e8ef="" className="rechargeh__container-content">{" "}<input type="hidden" name="limit_from" id="limit_from" defaultValue="70" />{" "}<input type="hidden" name="limit_to" id="limit_to" defaultValue="10" />{" "}{" "}{querySalaryBonus.map((valSalaryBonus: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-8407e8ef="" className="rechargeh__container-content__item">{" "}<div data-v-8407e8ef="" className="rechargeh__container-content__item-header"><span data-v-8407e8ef="" className="recharge_tit" style={{ paddingLeft: "10px", paddingRight: "10px" } as CSS}>{"REFERRAL BONUS REPORT"}</span>{" "}<div data-v-8407e8ef="" className="recharge_right recharge">{" "}<i data-v-8407e8ef="" className="van-badge__wrapper van-icon van-icon-arrow" /></div>{" "}</div>{" "}<div data-v-8407e8ef="" role="separator" className="van-divider van-divider--hairline divier">{" "}</div>{" "}<div data-v-8407e8ef="" className="rechargeh__container-content__item-body">{" "}<div data-v-8407e8ef="">{" "}<span data-v-8407e8ef="">{"INCOME FROM"}</span>{" "}<span data-v-8407e8ef="">{" "}{valSalaryBonus?.name}{" ("}{valSalaryBonus?.uid}{") "}</span>{" "}</div>{" "}<div data-v-8407e8ef="">{" "}<span data-v-8407e8ef="">{"RECHARGE AMOUNT"}</span>{" "}<span data-v-8407e8ef="">{" ₹"}{valSalaryBonus?.recharge_amount}{" "}</span>{" "}</div>{" "}<div data-v-8407e8ef="">{" "}<span data-v-8407e8ef="">{"BONUS PERCENT"}</span>{" "}<span data-v-8407e8ef="">{" "}{valSalaryBonus?.bonus_percent}{"% "}</span>{" "}</div>{" "}<div data-v-8407e8ef="">{" "}<span data-v-8407e8ef="">{"BONUS AMOUNT"}</span>{" "}<span data-v-8407e8ef="">{" ₹"}{valSalaryBonus?.bonus}{" "}</span>{" "}</div>{" "}<div data-v-8407e8ef="">{" "}<span data-v-8407e8ef="">{"Date"}</span>{" "}<span data-v-8407e8ef="">{" "}{date("d-m-Y H:i", strtotime(valSalaryBonus?.date_time))}{" "}</span>{" "}</div>{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}</div>{" "}
    </>
  );
}
