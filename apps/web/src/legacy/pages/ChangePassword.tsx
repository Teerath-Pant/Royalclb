/* Generated from User/change_password.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, important } from "../php";
import inlineCss from "./css/ChangePassword.css?raw";

const DEFAULTS: Record<string, any> = {};

export const legacy = {
  stylesheets: [
  "/User/assets/css/modules-13a75a76.css",
  "/User/assets/css/page-activity-edd5885d.css",
  "/User/assets/css/page-home-4a55d8dd.css",
  "/User/assets/css/index-053c656b.css",
  "/User/assets/css/reset-7514927e.css",
  "/User/assets/css/page-login-3c8cfc52.css",
  "/User/assets/css/page-main-f7a20b18.css",
  "/User/css/dark-gold.css"
],
  inlineCss,
  tailwind: false,
  htmlStyle: "font-size:36px;",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function ChangePasswordView(props: Record<string, any>) {
  const { currentPage, memberId } = props;
  
  return (
    <>
      {" "}<div id="app" data-v-app="">{" "}<div data-v-0a573a5c="" className="LoginP-container" ref={important("padding-bottom:3rem !important")} style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div onClick={() => window.history.back()} data-v-3949aac6="" className="backIcon" id="backbuttom" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-2f448113="" className="navbar__content-title" style={{ color: "#FDE4BC" } as CSS}>{"Change Password"}</div>{" "}<div data-v-3949aac6="" className="navbar__content-title" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div onClick={() => window.history.forward()} data-v-3949aac6="" className="backIcon" id="backbuttom2" />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<form action="changePassBack.php" method="POST">{" "}<div data-v-0a573a5c="" className="LoginP-container-form">{" "}<div data-v-a4bb5eb4="" data-v-0a573a5c="" className="passwordInput__container">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/password-c9fb65d7.png" src="/User/assets/png/password.png" /><span data-v-a4bb5eb4="">{"Old password"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="password" placeholder="Old password" maxLength={32} autoComplete="new-password" name="old_pass" id="old_pass" />{" "}<input data-v-a4bb5eb4="" type="hidden" placeholder="Old password" maxLength={32} autoComplete="new-password" name="id" id="id" defaultValue={memberId} />{" "}<img data-v-a4bb5eb4="" src="/User/assets/png/eye.png" className="eye" />{" "}</div>{" "}</div>{" "}<div data-v-a4bb5eb4="" data-v-0a573a5c="" className="passwordInput__container">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/password-c9fb65d7.png" src="/User/assets/png/password.png" /><span data-v-a4bb5eb4="">{"New login password"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="password" placeholder="New login password" maxLength={15} autoComplete="new-password" name="new_pass" id="new_pass" />{" "}<img data-v-a4bb5eb4="" src="/User/assets/png/eye.png" className="eye" />{" "}</div>{" "}</div>{" "}<div data-v-a4bb5eb4="" data-v-0a573a5c="" className="passwordInput__container mgb48">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/password-c9fb65d7.png" src="/User/assets/png/password.png" /><span data-v-a4bb5eb4="">{"Confirm new password"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="password" placeholder="Confirm new password" maxLength={15} autoComplete="new-password" name="co_pass" id="co_pass" />{" "}<img data-v-a4bb5eb4="" src="/User/assets/png/eye.png" className="eye" />{" "}</div>{" "}</div>{" "}<div data-v-0a573a5c="" className="LoginP-container-button" ref={important("margin-top:0rem !important")}>{" "}<button data-v-0a573a5c="" name="changePass">{"Save changes"}</button>{" "}</div>{" "}</div>{" "}</form>{" "}</div>{" "}<div data-v-9f348ae7="" data-v-6d6f3f35="" className="dialog inactive" id="first-dialog">{" "}<div data-v-9f348ae7="" className="dialog__container" role="dialog" tabIndex={0}>{" "}<div data-v-9f348ae7="" className="dialog__container-img"><img data-v-9f348ae7="" alt="" className="" data-origin="assets/png/orderCancelWarn-a1dd1459.png" src="/User/assets/png/password.png" /></div>{" "}<div data-v-9f348ae7="" className="dialog__container-title">{" "}<h1 id="messages" />{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__container-content">{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__container-footer">{" "}<button data-v-6d6f3f35="" className="dialogBtn" data-todo-onclick="closedialog()">{"Cancel"}</button>{" "}</div>{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__outside" />{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}</div>{" "}<div data-v-app="" />{" "}
    </>
  );
}
