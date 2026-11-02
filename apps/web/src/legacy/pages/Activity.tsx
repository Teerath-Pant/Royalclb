/* Generated from User/activity.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, formatAmount } from "../php";
import inlineCss from "./css/Activity.css?raw";

const DEFAULTS: Record<string, any> = {
  "quickActivities": [
    {
      "title": "Gifts",
      "icon": "/User/images/signInBanner-33f86d3f.png",
      "link": "/gift-redeem"
    },
    {
      "title": "Attendance Bonus",
      "icon": "/User/images/giftRedeem-45917887.png",
      "link": "/attendance"
    }
  ],
  "activityBanners": [
    {
      "title": "FIRST DEPOSIT BONUS",
      "image": "/User/images/Banner_20240322141441yrry.jpg",
      "class": "act_0",
      "link": "/first-deposit-bonus"
    },
    {
      "title": "DAILY BONUS",
      "image": "/User/images/Banner_20240327161931king.jpg",
      "class": "act_3",
      "link": "#"
    },
    {
      "title": "SUPPORT FUNDS",
      "image": "/User/images/Banner_20240322134401ujk4.jpg",
      "class": "act_6",
      "link": "#"
    }
  ],
  "depositTiers": [
    {
      "deposit": 220000,
      "bonus": 12555
    },
    {
      "deposit": 100000,
      "bonus": 8555
    },
    {
      "deposit": 30000,
      "bonus": 2555
    },
    {
      "deposit": 10000,
      "bonus": 1555
    },
    {
      "deposit": 3000,
      "bonus": 555
    },
    {
      "deposit": 1000,
      "bonus": 255
    },
    {
      "deposit": 400,
      "bonus": 105
    },
    {
      "deposit": 200,
      "bonus": 55
    }
  ]
};

export const legacy = {
  stylesheets: [
  "/User/assets/css/modules-13a75a76.css",
  "/User/assets/css/page-activity-edd5885d.css",
  "/User/assets/css/page-home-4a55d8dd.css",
  "/User/assets/css/index-053c656b.css",
  "/User/assets/css/reset-7514927e.css"
],
  inlineCss,
  tailwind: false,
  htmlStyle: "font-size:36px;",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function ActivityView(props: Record<string, any>) {
  const { activityBanners = DEFAULTS.activityBanners, currentPage, depositTiers = DEFAULTS.depositTiers, quickActivities = DEFAULTS.quickActivities } = props;
  
  return (
    <>
      {" "}<div id="app" data-v-app="">{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.back()} />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-2f448113="" className="navbar__content-title" style={{ color: "#FDE4BC" } as CSS}>{"Activity Management"}</div>{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.forward()} />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-8c2f9d50="" data-v-038de6ba="" className="activity-wrapper" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-8c2f9d50="" className="activity-banner">{" "}<div data-v-8c2f9d50="">{" "}<div data-v-8c2f9d50="" className="banner-title">{"Activity"}</div>{" "}<div data-v-8c2f9d50="" className="banner-para">{"Please Remember to follow the Event Page !!!"}</div>{" "}</div>{" "}</div>{" "}<div data-v-8c2f9d50="" className="activity-panel">{" "}<div data-v-8c2f9d50="" className="activity-panel-header lg0" />{" "}<div data-v-8c2f9d50="" className="activity-panel-content">{" "}{quickActivities.map((activity: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-8c2f9d50="" className="content-title" onClick={() => go(activity?.link)}>{" "}<img data-v-8c2f9d50="" src={activity?.icon} alt={activity?.title} />{" "}<div data-v-8c2f9d50="" className="content-para">{activity?.title}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}</div>{" "}<div data-v-8c2f9d50="" role="feed" className="van-list" aria-busy="false">{" "}<div data-v-8c2f9d50="" className="activitySection__container">{" "}{activityBanners.map((banner: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-8c2f9d50="" className="box" onClick={() => go(banner?.link)}>{" "}<img data-v-8c2f9d50="" src={banner?.image} className={banner?.class} alt={banner?.title} />{" "}<div data-v-8c2f9d50="" className="box-content">{" "}<div data-v-8c2f9d50="" className="box-title">{banner?.title}</div>{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}<div className="van-list__finished-text">{"No more"}</div>{" "}<div className="van-list__placeholder" />{" "}</div>{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}<div className="van-overlay" style={{ zIndex: "2003", "--80613dcc": "'Roboto', 'Inter', sans-serif", display: "none" } as CSS} />{" "}<div role="dialog" tabIndex={0} className="van-popup van-popup--center van-dialog firstSaveDialog" style={{ zIndex: "2003", "--80613dcc": "'Roboto', 'Inter', sans-serif", display: "none" } as CSS}>{" "}<div className="van-dialog__header">{" "}<div data-v-83c4928f="" className="header">{" "}<div data-v-83c4928f="" className="title">{"Extra first deposit bonus"}</div>{" "}<div data-v-83c4928f="" className="tip">{"Each account can only receive rewards once"}</div>{" "}</div>{" "}</div>{" "}<div className="van-dialog__content">{" "}<div data-v-83c4928f="" className="container">{" "}{depositTiers.map((tier: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-0ef944d2="" className="first_list-item">{" "}<div data-v-0ef944d2="" className="head">{" "}<div data-v-0ef944d2="" className="title">{"First deposit"}<span data-v-0ef944d2="">{String(tier?.deposit)}</span></div>{" "}<div data-v-0ef944d2="" className="orange">{"+ ₹"}{formatAmount(tier?.bonus)}</div>{" "}</div>{" "}<div data-v-0ef944d2="" className="description">{"Deposit "}{String(tier?.deposit)}{" for the first time and you will receive "}{String(tier?.bonus)}{" bonus"}</div>{" "}<div data-v-0ef944d2="" className="foot">{" "}<div data-v-af137d05="" data-v-0ef944d2="" className="progress" style={{ background: "rgb(232, 232, 232)", height: "16px", borderRadius: "16px" } as CSS}>{" "}<div data-v-af137d05="" className="line" style={{ background: "rgb(235, 138, 31)", width: "0%", height: "16px", borderRadius: "16px" } as CSS} />{" "}<div data-v-af137d05="" className="step">{"0/"}{String(tier?.deposit)}</div>{" "}</div>{" "}<div data-v-0ef944d2="" className="btn n2" onClick={() => go("/recharge")}>{"Deposit"}</div>{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}<div data-v-83c4928f="" className="close" />{" "}</div>{" "}<div data-v-83c4928f="" className="footer">{" "}<div data-v-83c4928f="" className="active">{"No more reminders today"}</div>{" "}<div data-v-83c4928f="" className="btn">{"Activity"}</div>{" "}</div>{" "}</div>{" "}</div>{" "}
    </>
  );
}
