/* Generated from User/viewCommission.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, date, important, number_format, strtotime } from "../php";
import inlineCss from "./css/ViewCommission.css?raw";

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
export function ViewCommissionView(props: Record<string, any>) {
  const { _GET, currentPage, valSum } = props;
  let from_date: any = (_GET?.from_date ?? null) !== null && _GET?.from_date !== "" ? _GET?.from_date : date("Y-m-d"); let to_date: any = (_GET?.to_date ?? null) !== null && _GET?.to_date !== "" ? _GET?.to_date : date("Y-m-d"); from_date = date("Y-m-d", strtotime(from_date)); to_date = date("Y-m-d", strtotime(to_date));
  return (
    <>
      {" "}<div id="app" data-v-app="">{" "}<div data-v-94f2e2ba="" className="ar-loading-view" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS} id="loadingloader">{" "}<div data-v-94f2e2ba="" className="loading-wrapper">{" "}<div data-v-94f2e2ba="" className="loading-animat">{" "}<div className="loading-container" id="loadingloader">{" "}<div className="loading" />{" "}<div id="loading-text" style={{ padding: "0px", margin: "0px", paddingTop: "8px", paddingLeft: "5px" } as CSS}><img src="/User/assets/png/loader.png" style={{ height: "80px" } as CSS} /></div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-8407e8ef="" className="rechargeh__container" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "#0000) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div onClick={() => go("/home")} data-v-3949aac6="" className="backIcon" id="backbuttom" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-3949aac6="" className="headLogo" ref={important("background-image:url(assets/jpg/mgg3.png) !important")} />{" "}<div data-v-3949aac6="" className="navbar__content-title" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div onClick={() => window.history.forward()} data-v-3949aac6="" className="backIcon" id="backbuttom2" />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-8ccc2c7e="" className="content" ref={important("margin-bottom:0rem !important;padding-bottom: 0rem !important")} style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-8ccc2c7e="" className="shareBtnContainer" ref={important("margin-bottom:0rem !important;padding:0px !important")}>{" "}<button data-v-8ccc2c7e="" className="shareBtn btn copyBtn">{" COMMISSION HISTORY "}</button>{" "}</div>{" "}</div>{" "}<div data-v-d87f1a64="" data-v-8407e8ef="" className="infiniteScroll" id="refresh294e717922c845fc93e956259592f9c4">{" "}<input type="hidden" id="userid" name="userid" defaultValue="1" />{" "}<div id="result_report">{" "}<div data-v-8407e8ef="" className="rechargeh__container-content">{" "}<input type="hidden" name="limit_from" id="limit_from" defaultValue="70" />{" "}<input type="hidden" name="limit_to" id="limit_to" defaultValue="10" />{" "}{/* PHP: date_default_timezone_set("Asia/Kolkata") */}{" "}<form method="GET" style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "10px", width: "100%", maxWidth: "480px", margin: "0 auto", boxSizing: "border-box" } as CSS}>{" "}<div style={{ flex: "1 1 130px", minWidth: "0" } as CSS}>{" "}<input type="date" name="from_date" defaultValue={from_date} style={{ width: "100%", height: "38px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #443c44", backgroundColor: "#ffffff", color: "#110D14", fontSize: "13px", fontWeight: "600", boxSizing: "border-box", outline: "none" } as CSS} />{" "}</div>{" "}<div style={{ flex: "1 1 130px", minWidth: "0" } as CSS}>{" "}<input type="date" name="to_date" defaultValue={to_date} style={{ width: "100%", height: "38px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #443c44", backgroundColor: "#ffffff", color: "#110D14", fontSize: "13px", fontWeight: "600", boxSizing: "border-box", outline: "none" } as CSS} />{" "}</div>{" "}<button type="submit" style={{ height: "38px", padding: "0 16px", backgroundColor: "#ffffff", color: "#110D14", border: "1px solid #ffffff", borderRadius: "6px", fontWeight: "700", fontSize: "13px", cursor: "pointer", flex: "0 0 auto", whiteSpace: "nowrap", transition: "opacity 0.2s" } as CSS}>{" Search "}</button>{" "}</form>{" "}<div data-v-8407e8ef="" className="rechargeh__container-content__item">{" "}<div data-v-8407e8ef="" className="rechargeh__container-content__item-header">{" "}<span data-v-8407e8ef="" className="recharge_tit" style={{ paddingLeft: "10px", paddingRight: "10px" } as CSS}>{"BET COMMISSION"}</span>{" "}</div>{" "}<div data-v-8407e8ef="" role="separator" className="van-divider van-divider--hairline divier" />{" "}<div data-v-8407e8ef="" className="rechargeh__container-content__item-body">{" "}<div data-v-8407e8ef=""><span data-v-8407e8ef="">{"FROM"}</span><span data-v-8407e8ef="">{date("d-m-Y", strtotime(from_date))}</span></div>{" "}<div data-v-8407e8ef=""><span data-v-8407e8ef="">{"TO"}</span><span data-v-8407e8ef="">{date("d-m-Y", strtotime(to_date))}</span></div>{" "}<div data-v-8407e8ef=""><span data-v-8407e8ef="">{"TOTAL COMMISSION"}</span><span data-v-8407e8ef="" className="price">{"₹"}{number_format(valSum?.total_commission, 2, '.', '')}</span></div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}</div>{" "}
    </>
  );
}
