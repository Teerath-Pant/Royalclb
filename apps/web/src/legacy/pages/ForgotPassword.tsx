/* Generated from User/forgot_password.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, important } from "../php";
import inlineCss from "./css/ForgotPassword.css?raw";

const DEFAULTS: Record<string, any> = {};

export const legacy = {
  stylesheets: [
  "/User/assets/css/modules-13a75a76.css",
  "/User/assets/css/page-activity-edd5885d.css",
  "/User/assets/css/page-home-4a55d8dd.css",
  "/User/assets/css/index-053c656b.css",
  "/User/assets/css/reset-7514927e.css",
  "/User/assets/css/page-login-3c8cfc52.css",
  "/User/assets/css/index-0a9fff24.css",
  "/User/css/mycss.css",
  "/User/css/dark-gold.css"
],
  inlineCss,
  tailwind: false,
  htmlStyle: "",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function ForgotPasswordView(props: Record<string, any>) {
  const {  } = props;
  
  return (
    <>
      {" "}<div id="app" data-v-app="">{" "}<div data-v-6741ac8c="" className="resgister__C" ref={important("padding-bottom:45px !important")} style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div onClick={() => window.history.back()} data-v-3949aac6="" className="backIcon" id="backbuttom" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-3949aac6="" className="headLogo" ref={important("background-image:url(\u00010\u0002) !important")} />{" "}<div data-v-3949aac6="" className="navbar__content-title" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div onClick={() => window.history.forward()} data-v-3949aac6="" className="backIcon" id="backbuttom2" />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-6741ac8c="" className="resgister__C-heading">{" "}<h1 data-v-6741ac8c="" className="resgister__C-heading__title">{"Forgot Password"}</h1>{" "}<div data-v-6741ac8c="" className="resgister__C-heading__subTitle">{" No worries! just enter your email below, and we'll send you an OTP to reset your password. Verify the OTP, set a new password, and you're all set! "}</div>{" "}</div>{" "}<div data-v-6741ac8c="" className="login_container-tab">{" "}<div data-v-6741ac8c="" className="tab active" id="phonetabactive" data-todo-onclick="phoneactive()">{" "}<div data-v-6741ac8c="" className="phonebg phoneactive" id="phonebgactive" />{" "}<div data-v-6741ac8c="" className="font30 phonefont30active" id="phonefontactive">{"Forgot Password"}</div>{" "}</div>{" "}</div>{" "}<div data-v-6741ac8c="" className="resgister__C-form">{" "}<form action="forgotPasswordBack.php" method="post" autoComplete="on">{" "}<div data-v-6741ac8c="" className="tab-content activecontent" id="MyElementphone">{" "}<div data-v-f2791930="" data-v-6741ac8c="" className="register__container">{" "}<div data-v-a4bb5eb4="" data-v-f2791930="" className="passwordInput__container">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/password.png" src="/User/assets/png/phone.png" /><span data-v-a4bb5eb4="">{"Mobile Number"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="text" placeholder="Mobile Number" id="inputPhone" maxLength={10} name="phone" required />{" "}</div>{" "}<button type="button" id="otp-btn" className="send-otp-btn">{"Send OTP"}</button>{" "}</div>{" "}<div data-v-a4bb5eb4="" data-v-f2791930="" className="passwordInput__container">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/password.png" src="/User/assets/png/feedback.png" /><span data-v-a4bb5eb4="">{"OTP"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="text" placeholder="OTP" id="otp" name="otp" required />{" "}</div>{" "}</div>{" "}<div data-v-a4bb5eb4="" data-v-f2791930="" className="passwordInput__container">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/password.png" src="/User/assets/png/password.png" /><span data-v-a4bb5eb4="">{"New Password"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="password" placeholder="Password" maxLength={15} id="inputPassword" name="password" required />{" "}<img data-v-a4bb5eb4="" src="/User/assets/png/eye.png" className="eye" />{" "}</div>{" "}</div>{" "}<div data-v-f2791930="" className="register__container-button">{" "}<button data-v-f2791930="" name="forgotPassword">{"Submit"}</button>{" "}<button data-v-f2791930="" className="login">{" "}<div data-v-f2791930="" className="account">{"Back to"}</div>{" "}<div data-v-f2791930="" className="loginin"><a href="/login">{"Login"}</a></div>{" "}</button>{" "}</div>{" "}</div>{" "}</div>{" "}</form>{" "}<div data-v-9f348ae7="" data-v-6d6f3f35="" className="dialog inactive" id="first-dialog">{" "}<div data-v-9f348ae7="" className="dialog__container" role="dialog" tabIndex={0}>{" "}<div data-v-9f348ae7="" className="dialog__container-img"><img data-v-9f348ae7="" alt="" className="" data-origin="assets/png/orderCancelWarn-a1dd1459.png" src="/User/assets/png/orderCancelWarn-a1dd1459.png" /></div>{" "}<div data-v-9f348ae7="" className="dialog__container-title">{" "}<h1 id="messages" />{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__container-content">{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__container-footer">{" "}<button data-v-6d6f3f35="" className="dialogBtn" data-todo-onclick="closedialog()">{"Cancel"}</button>{" "}</div>{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__outside" />{" "}</div>{" "}<div data-v-9f348ae7="" data-v-6d6f3f35="" className="dialog inactive" id="first-dialog2">{" "}<div data-v-9f348ae7="" className="dialog__container" role="dialog" tabIndex={0}>{" "}<div data-v-9f348ae7="" className="dialog__container-img"><img data-v-9f348ae7="" alt="" className="" data-origin="assets/png/orderCancelWarn-a1dd1459.png" src="/User/assets/png/crown1-3912fd85.png" /></div>{" "}<div data-v-9f348ae7="" className="dialog__container-title" style={{ textAlign: "center" } as CSS}>{" "}<h1>{"Dear Sir, Please Check Login !!"}</h1>{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__container-content">{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__container-footer">{" "}<button data-v-6d6f3f35="" className="dialogBtn" data-todo-onclick="closedialog2()">{"OK DONE"}</button>{" "}</div>{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__outside" />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}
    </>
  );
}
