/* Generated from User/login.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, important } from "../php";
import inlineCss from "./css/Login.css?raw";

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
  tailwind: true,
  htmlStyle: "font-size:36px;",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function LoginView(props: Record<string, any>) {
  const {  } = props;
  
  return (
    <>
      {" "}{/* PHP: _Init() */}{" "}<div id="app" data-v-app="">{" "}<div data-v-6741ac8c="" className="resgister__C" ref={important("padding-bottom:45px !important")} style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div onClick={() => window.history.back()} data-v-3949aac6="" className="backIcon" id="backbuttom" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-3949aac6="" className="headLogo" ref={important("background-image:url(\u00011\u0002) !important")} />{" "}<div data-v-3949aac6="" className="navbar__content-title" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div onClick={() => window.history.forward()} data-v-3949aac6="" className="backIcon" id="backbuttom2" />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-6741ac8c="" className="resgister__C-heading">{" "}<h1 data-v-6741ac8c="" className="resgister__C-heading__title">{"Log In"}</h1>{" "}<div data-v-6741ac8c="" className="resgister__C-heading__subTitle"><span data-v-6741ac8c="">{"Please Log in With Your Phone Number or Email "}<br />{"you forget your password, please contact customer service"}</span></div>{" "}</div>{" "}<div data-v-6741ac8c="" className="login_container-tab">{" "}<div data-v-6741ac8c="" className="tab active" id="phonetabactive" data-todo-onclick="phoneactive()">{" "}<div data-v-6741ac8c="" className="phonebg phoneactive" id="phonebgactive" />{" "}<div data-v-6741ac8c="" className="font30 phonefont30active" id="phonefontactive">{"Login Your Phone"}</div>{" "}</div>{" "}</div>{" "}<div data-v-6741ac8c="" className="resgister__C-form">{" "}<form id="loginForm" method="post" autoComplete="on">{" "}<div data-v-6741ac8c="" className="tab-content activecontent" id="MyElementphone">{" "}<div data-v-f2791930="" data-v-6741ac8c="" className="register__container">{" "}<div data-v-a4bb5eb4="" data-v-f2791930="" className="passwordInput__container">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/password.png" src="/User/assets/png/password.png" /><span data-v-a4bb5eb4="">{"Mobile Number"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="text" placeholder="Mobile Number" id="inputPhone" maxLength={10} name="phone" required />{" "}</div>{" "}</div>{" "}<div data-v-a4bb5eb4="" data-v-f2791930="" className="password Input__container">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label">{" "}<img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/password.png" src="/User/assets/png/password.png" /><span data-v-a4bb5eb4="">{"Password"}</span>{" "}</div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="password" placeholder="Password" maxLength={15} id="inputPassword" name="password" required />{" "}<img data-v-a4bb5eb4="" src="/User/assets/png/eye.png" className="eye" id="togglePassword" style={{ cursor: "pointer" } as CSS} alt="Toggle Password Visibility" />{" "}</div>{" "}<a href="/forgot-password" className="forgot-pass">{"Forgot Password"}</a>{" "}</div>{" "}<div data-v-a4bb5eb4="" data-v-f2791930="" className="passwordInput__container hide" id="otpSection">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><span data-v-a4bb5eb4="">{"Email OTP"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="text" inputMode="numeric" placeholder="Enter 6-digit OTP" maxLength={6} id="inputOtp" name="otp" />{" "}</div>{" "}</div>{" "}<div data-v-f2791930="" className="register__container-tip" style={{ display: "none" } as CSS}>{" "}<div data-v-f2791930="" className="tipbg" />{" "}<span data-v-f2791930="">{"The password must be at least 8 digits and must contain letters + numbers"}</span>{" "}</div>{" "}<div data-v-f2791930="" className="register__container-tips" style={{ display: "none" } as CSS} id="login_m"><span data-v-f2791930="" id="phone_msg" /></div>{" "}<div data-v-f2791930="" className="register__container-remember">{" "}<label className="newcheckbox">{" "}<input type="checkbox" defaultChecked name="" />{" "}<span className="checkmark" />{" "}</label>{" "}<span className="van-checkbox__label">{"Remember password"}</span>{" "}</div>{" "}<div data-v-f2791930="" className="register__container-button">{" "}<button data-v-f2791930="" id="loginBtn" type="submit">{"Login"}</button>{" "}<button data-v-f2791930="" className="login" type="button">{" "}<div data-v-f2791930="" className="account">{"You Have No account"}</div>{" "}<div data-v-f2791930="" className="loginin"><a href="../register.php">{"Register"}</a></div>{" "}</button>{" "}</div>{" "}</div>{" "}</div>{" "}</form>{" "}</div>{" "}</div>{" "}</div>{" "}
    </>
  );
}
