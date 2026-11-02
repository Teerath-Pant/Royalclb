/* Generated from User/team.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, date, important, strtotime } from "../php";
import inlineCss from "./css/Team.css?raw";

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
export function TeamView(props: Record<string, any>) {
  const { currentPage, queryTeam, totalInvest } = props;
  let limit: any = 1000; let count: any = 0;
  return (
    <>
      {" "}<div id="app" data-v-app="">{" "}<div data-v-94f2e2ba="" className="ar-loading-view" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS} id="loadingloader">{" "}<div data-v-94f2e2ba="" className="loading-wrapper">{" "}<div data-v-94f2e2ba="" className="loading-animat">{" "}<div className="loading-container" id="loadingloader">{" "}<div className="loading" />{" "}<div id="loading-text" style={{ padding: "0px", margin: "0px", paddingTop: "8px", paddingLeft: "5px" } as CSS}><img src="/User/assets/png/loader.png" style={{ height: "80px" } as CSS} /></div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-8407e8ef="" className="rechargeh__container" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "#0000) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div onClick={() => go("/home")} data-v-3949aac6="" className="backIcon" id="backbuttom" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-3949aac6="" className="headLogo" ref={important("background-image:url(assets/jpg/mgg3.png) !important")} />{" "}<div data-v-3949aac6="" className="navbar__content-title" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div onClick={() => window.history.forward()} data-v-3949aac6="" className="backIcon" id="backbuttom2" />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-8ccc2c7e="" className="content" ref={important("margin-bottom:0rem !important;padding-bottom: 0rem !important")} style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-8ccc2c7e="" className="shareBtnContainer" ref={important("margin-bottom:0rem !important;padding:0px !important")}>{" "}<button data-v-8ccc2c7e="" className="shareBtn btn copyBtn">{"MY ALL TEAM"}</button>{" "}</div>{" "}</div>{" "}<div data-v-d87f1a64="" data-v-8407e8ef="" className="infiniteScroll" id="refresh294e717922c845fc93e956259592f9c4">{" "}<input type="hidden" id="userid" name="userid" defaultValue="1" />{" "}<div id="result_report">{" "}<div data-v-8407e8ef="" className="rechargeh__container-content">{" "}<input type="hidden" name="limit_from" id="limit_from" defaultValue="0" />{" "}<input type="hidden" name="limit_to" id="limit_to" defaultValue="10" />{" "}{queryTeam.map((valTeam: any, _i: number) => { const count = _i + 1; return (<Fragment key={_i}>{" "}<div data-v-8407e8ef="" className="rechargeh__container-content__item">{" "}<div data-v-8407e8ef="" className="rechargeh__container-content__item-header"><span data-v-8407e8ef="" className="recharge_tit" style={{ paddingLeft: "10px", paddingRight: "10px" } as CSS}>{"MY TEAM ( "}{date("d-m-Y", strtotime(valTeam?.date_time))}{" )"}</span>{" "}<div data-v-8407e8ef="" className="recharge_right recharge">{" "}<i data-v-8407e8ef="" className="van-badge__wrapper van-icon van-icon-arrow" /></div>{" "}</div>{" "}<div data-v-8407e8ef="" role="separator" className="van-divider van-divider--hairline divier">{" "}</div>{" "}<div data-v-8407e8ef="" className="rechargeh__container-content__item-body">{" "}<div data-v-8407e8ef=""><span data-v-8407e8ef="">{"USER-ID"}</span><span data-v-8407e8ef="" className="price">{valTeam?.uid}</span></div>{" "}<div data-v-8407e8ef=""><span data-v-8407e8ef="">{"REFERRAL CODE"}</span><span data-v-8407e8ef="" className="price">{valTeam?.user_id}</span></div>{" "}<div data-v-8407e8ef=""><span data-v-8407e8ef="">{"SPONSER ID"}</span><span data-v-8407e8ef="" className="price">{valTeam?.referral_user_id}</span></div>{" "}<div data-v-8407e8ef=""><span data-v-8407e8ef="">{"LEVEL"}</span><span data-v-8407e8ef="" className="level">{valTeam?.level}</span></div>{" "}<div data-v-8407e8ef=""><span data-v-8407e8ef="">{"ACTIVE STATUS"}</span><span data-v-8407e8ef="">{(valTeam?.topup_flag === 1) ? ("Active") : ("In-Active")}</span>{" "}</div>{" "}<div data-v-8407e8ef=""><span data-v-8407e8ef="">{"TOTAL DEPOSIT"}</span><span data-v-8407e8ef="">{"₹ "}{totalInvest(valTeam?.member_id)}</span>{" "}</div>{" "}<div data-v-8407e8ef=""><span data-v-8407e8ef="">{"Reg. Date"}</span><span data-v-8407e8ef="">{date("d-m-Y H:i:s", strtotime(valTeam?.date_time))}</span>{" "}</div>{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}<div data-v-353a60df="" className="GameRecord__C-foot">{" "}<div data-v-353a60df="" className="GameRecord__C-foot-previous">{" "}<i data-v-353a60df="" className="van-badge__wrapper van-icon van-icon-arrow-left GameRecord__C-icon" style={{ fontSize: "20px" } as CSS} />{" "}</div>{" "}<div data-v-353a60df="" className="GameRecord__C-foot-page" id="paginationDisplay">{" "}{count}{"/"}{limit}</div>{" "}<div data-v-353a60df="" className="GameRecord__C-foot-next">{" "}<i data-v-353a60df="" className="van-badge__wrapper van-icon van-icon-arrow GameRecord__C-icon" style={{ fontSize: "20px" } as CSS} />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}</div>{" "}
    </>
  );
}
