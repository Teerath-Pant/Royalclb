/* Generated from User/gift-redeem.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go } from "../php";
import inlineCss from "./css/GiftRedeemShell.css?raw";

const DEFAULTS: Record<string, any> = {};

export const legacy = {
  stylesheets: [
  "/User/assets/css/modules-b642e9bc.css",
  "/User/assets/css/page-activity-e94516d2.css",
  "/User/assets/css/index-37a2335c.css",
  "/User/assets/css/page-home-3889ef4f.css",
  "/User/assets/css/page-login-7527a426.css",
  "/User/assets/css/page-main-5a34fc00.css",
  "/User/assets/css/page-home-4a55d8dd.css"
],
  inlineCss,
  tailwind: true,
  htmlStyle: "",
  bodyStyle: "font-size: 12px; background: #232328; color: #fff;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function GiftRedeemShellView(props: Record<string, any>) {
  const {  } = props;
  
  return (
    <>
      {" "}{/* PHP: _Init() */}{" "}<div id="app" data-v-app="" style={{ minHeight: "100vh" } as CSS}>{" "}<div id="gift-redeem" />{" "}</div>{" "}
    </>
  );
}
