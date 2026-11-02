/* Generated from User/settings.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go } from "../php";
import inlineCss from "./css/Settings.css?raw";

const DEFAULTS: Record<string, any> = {
  "settingItems": [
    {
      "title": "My Profile",
      "icon": "/User/assets/png/time_a-afd768a9.png",
      "link": "/profile"
    },
    {
      "title": "Login password",
      "icon": "/User/assets/png/time_a-afd768a9.png",
      "link": "/change-password"
    },
    {
      "title": "Withdrawal Methods",
      "icon": "/User/assets/png/time_a-afd768a9.png",
      "link": "/withdrawal-methods"
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
  "/User/assets/css/page-wallet-d7e3e5ae.css",
  "/User/assets/css/page-vip-66c7789a.css"
],
  inlineCss,
  tailwind: true,
  htmlStyle: "font-size:36px;",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function SettingsView(props: Record<string, any>) {
  const { currentPage, settingItems = DEFAULTS.settingItems } = props;
  
  return (
    <>
      {" "}{/* PHP: _Init() */}{" "}<div id="app" data-v-app="" style={{ padding: "0 .32rem .32rem" } as CSS}>{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.back()} />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-2f448113="" className="navbar__content-title" style={{ color: "#FDE4BC" } as CSS}>{"Profile Settings"}</div>{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.forward()} />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div style={{ marginBottom: "2.5rem" } as CSS}>{" "}<div data-v-271ecdd2="" className="content setting-wrapper" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-271ecdd2="" className="setting-items-wrapper">{" "}<div data-v-271ecdd2="" className="content-sub_title">{" "}<div data-v-271ecdd2="">{"Security information"}</div>{" "}</div>{" "}{settingItems.map((item: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-271ecdd2="" className="phone_container">{" "}<div data-v-271ecdd2="" className="phone_container-item" onClick={() => go(item?.link)}>{" "}<div data-v-271ecdd2="" className="phone_container-item-left">{" "}<img data-v-271ecdd2="" src={item?.icon} alt={item?.title} />{" "}<span data-v-271ecdd2="">{item?.title}</span>{" "}</div>{" "}<div data-v-271ecdd2="" className="phone_container-item-right">{" "}<span data-v-271ecdd2="">{"Edit"}</span>{" "}<i data-v-271ecdd2="" className="van-badge__wrapper van-icon van-icon-arrow" style={{ color: "rgb(136, 136, 136)" } as CSS} />{" "}</div>{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}<div data-v-271ecdd2="" className="phone_container">{" "}<div data-v-271ecdd2="" className="phone_container-item">{" "}<div data-v-271ecdd2="" className="phone_container-item-left">{" "}<img data-v-271ecdd2="" src="/User/assets/png/time_a-afd768a9.png" alt="Two-Factor Authentication" />{" "}<span data-v-271ecdd2="">{"Two-Factor Authentication (Email OTP)"}</span>{" "}</div>{" "}<div data-v-271ecdd2="" className="phone_container-item-right">{" "}<label className="toggle-switch">{" "}<input type="checkbox" id="twoFactorToggle" />{" "}<span className="slider" />{" "}</label>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}</div>{" "}
    </>
  );
}
