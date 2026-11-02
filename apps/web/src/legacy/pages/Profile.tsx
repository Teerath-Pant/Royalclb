/* Generated from User/profile.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, important } from "../php";
import inlineCss from "./css/Profile.css?raw";

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
  "/User/assets/css/page-main-f7a20b18.css",
  "/User/css/dark-gold.css"
],
  inlineCss,
  tailwind: false,
  htmlStyle: "font-size:36px;",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function ProfileView(props: Record<string, any>) {
  const { currentPage, emailId, memberId, phone, uid, userName } = props;
  
  return (
    <>
      {" "}<div id="app" data-v-app="">{" "}<div data-v-0a573a5c="" className="LoginP-container" ref={important("padding-bottom:3rem !important")} style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div onClick={() => window.history.back()} data-v-3949aac6="" className="backIcon" id="backbuttom" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-2f448113="" className="navbar__content-title" style={{ color: "#FDE4BC" } as CSS}>{"Update Profile"}</div>{" "}<div data-v-3949aac6="" className="navbar__content-title" />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div onClick={() => window.history.forward()} data-v-3949aac6="" className="backIcon" id="backbuttom2" />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<form action="updateProfileBack.php" method="POST" encType="multipart/form-data">{" "}<div data-v-0a573a5c="" className="LoginP-container-form">{" "}<div data-v-a4bb5eb4="" data-v-0a573a5c="" className="passwordInput__container mgb48">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/customer-90069cd2 (2).png" src="/User/assets/png/customer-90069cd2 (2).png" /><span data-v-a4bb5eb4="">{"UID"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="text" name="uid" id="uid" defaultValue={uid} readOnly />{" "}<input data-v-a4bb5eb4="" type="hidden" name="id" id="id" defaultValue={memberId} readOnly />{" "}</div>{" "}</div>{" "}<div data-v-a4bb5eb4="" data-v-0a573a5c="" className="passwordInput__container mgb48">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/customer-90069cd2 (2).png" src="/User/assets/png/customer-90069cd2 (2).png" /><span data-v-a4bb5eb4="">{"Name"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="text" name="name" id="name" defaultValue={userName} />{" "}</div>{" "}</div>{" "}<div data-v-a4bb5eb4="" data-v-0a573a5c="" className="passwordInput__container mgb48">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/customer-90069cd2 (2).png" src="/User/assets/png/customer-90069cd2 (2).png" /><span data-v-a4bb5eb4="">{"Mobile No"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="text" name="phone" id="phone" defaultValue={phone} readOnly />{" "}</div>{" "}</div>{" "}<div data-v-a4bb5eb4="" data-v-0a573a5c="" className="passwordInput__container mgb48">{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-label"><img data-v-a4bb5eb4="" className="passwordInput__container-label__icon" data-origin="assets/png/customer-90069cd2 (2).png" src="/User/assets/png/customer-90069cd2 (2).png" /><span data-v-a4bb5eb4="">{"Email"}</span></div>{" "}<div data-v-a4bb5eb4="" className="passwordInput__container-input">{" "}<input data-v-a4bb5eb4="" type="text" name="email" id="email" defaultValue={emailId} readOnly />{" "}</div>{" "}</div>{" "}<div data-v-0a573a5c="" className="LoginP-container-button" ref={important("margin-top:2rem !important")}>{" "}<button data-v-0a573a5c="" name="updateProfile">{"Update Profile"}</button>{" "}</div>{" "}</div>{" "}</form>{" "}</div>{" "}<div data-v-9f348ae7="" data-v-6d6f3f35="" className="dialog inactive" id="first-dialog">{" "}<div data-v-9f348ae7="" className="dialog__container" role="dialog" tabIndex={0}>{" "}<div data-v-9f348ae7="" className="dialog__container-img"><img data-v-9f348ae7="" alt="" className="" data-origin="assets/png/orderCancelWarn-a1dd1459.png" src="/User/assets/png/orderCancelWarn-a1dd1459.png" /></div>{" "}<div data-v-9f348ae7="" className="dialog__container-title">{" "}<h1 id="messages" />{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__container-content">{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__container-footer">{" "}<button data-v-6d6f3f35="" className="dialogBtn" data-todo-onclick="closedialog()">{"Cancel"}</button>{" "}</div>{" "}</div>{" "}<div data-v-9f348ae7="" className="dialog__outside" />{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}</div>{" "}<div data-v-app="" />{" "}
    </>
  );
}
