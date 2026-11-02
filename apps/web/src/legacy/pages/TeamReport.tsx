/* Generated from User/TeamReport.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go } from "../php";
import inlineCss from "./css/TeamReport.css?raw";

const DEFAULTS: Record<string, any> = {};

export const legacy = {
  stylesheets: [
  "/User/assets/css/modules-13a75a76.css",
  "/User/assets/css/page-home-4a55d8dd.css",
  "/User/assets/css/index-053c656b.css",
  "/User/css/TeamReport.css"
],
  inlineCss,
  tailwind: false,
  htmlStyle: "font-size:40px;",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function TeamReportView(props: Record<string, any>) {
  const { currentPage } = props;
  
  return (
    <>
      {" "}<div id="app" data-v-app="">{" "}<div data-v-94f2e2ba="" className="ar-loading-view" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS} id="loadingloader">{" "}<div data-v-94f2e2ba="" className="loading-wrapper">{" "}<div data-v-94f2e2ba="" className="loading-animat">{" "}<div className="loading-container" id="loadingloader">{" "}<div className="loading" />{" "}<div id="loading-text" style={{ padding: "0px", margin: "0px", paddingTop: "8px", paddingLeft: "5px" } as CSS}><img src="/User/assets/png/loader.png" style={{ height: "80px" } as CSS} /></div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-8407e8ef="" className="rechargeh__container" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div onClick={() => go("/home")} data-v-3949aac6="" className="backIcon" id="backbuttom" />{" "}</div>{" "}<div data-v-12a80a3e="" className="navbar__content-center">{" "}<div data-v-12a80a3e="" className="navbar__content-title">{"Subordinate data"}</div>{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div onClick={() => window.history.forward()} data-v-3949aac6="" className="backIcon" id="backbuttom2" />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-10d1559c="" className="TeamReport__C-head">{" "}<div data-v-10d1559c="" className="TeamReport__C-head-fixed">{" "}<div data-v-c06f3394="" data-v-10d1559c="" className="searchbar-container"><input data-v-c06f3394="" type="text" autoComplete="new-password" className="searchbar-container__searchbar" placeholder="Search subordinate UID" maxLength={30} id="uidInput" />{" "}<i data-v-10d1559c="" className="van-badge__wrapper van-icon van-icon-search" id="uidSearch" />{" "}</div>{" "}<div data-v-10d1559c="" className="TeamReport__C-head-line2">{" "}<div className="dropdown" id="categoryDropdown">{" "}<span className="default" id="categoryText">{"All"}</span>{" "}<i className="van-badge__wrapper van-icon van-icon-arrow-down" />{" "}<div className="dropdown-menu" id="categoryMenu">{" "}<div data-level="all">{"All"}</div>{" "}</div>{" "}</div>{" "}<div data-v-10d1559c="">{" "}<span data-v-10d1559c="" className="default" id="calendar">{" "}<input type="date" id="datePicker" /></span>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-10d1559c="" className="TeamReport__C-body">{" "}<div data-v-10d1559c="" className="header-container">{" "}<div data-v-10d1559c="">{" "}<div data-v-10d1559c="" className="num" id="dc">{"0"}</div>{" "}<div data-v-10d1559c="">{"Deposit number"}</div>{" "}</div>{" "}<div data-v-10d1559c="">{" "}<div data-v-10d1559c="" className="num" id="da">{"0"}</div>{" "}<div data-v-10d1559c="">{"Deposit amount"}</div>{" "}</div>{" "}<div data-v-10d1559c="">{" "}<div data-v-10d1559c="" className="num" id="bc">{"0"}</div>{" "}<div data-v-10d1559c="">{"Number of bettors"}</div>{" "}</div>{" "}<div data-v-10d1559c="">{" "}<div data-v-10d1559c="" className="num" id="ba">{"0"}</div>{" "}<div data-v-10d1559c="">{"Total bet"}</div>{" "}</div>{" "}<div data-v-10d1559c="">{" "}<div data-v-10d1559c="" className="num" id="fc">{"0"}</div>{" "}<div data-v-10d1559c="">{"Number of people making first deposit"}</div>{" "}</div>{" "}<div data-v-10d1559c="">{" "}<div data-v-10d1559c="" className="num" id="fa">{"0"}</div>{" "}<div data-v-10d1559c="">{"First deposit amount"}</div>{" "}</div>{" "}</div>{" "}<div data-v-cbab7763="" data-v-10d1559c="" className="infiniteScroll" id="team-data">{" "}</div>{" "}</div>{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}</div>{" "}
    </>
  );
}
