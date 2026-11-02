/* Generated from User/pay-online.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, APP_NAME, LOGO, important } from "../php";
import inlineCss from "./css/PayOnline.css?raw";

const DEFAULTS: Record<string, any> = {};

export const legacy = {
  stylesheets: [
  "https://fonts.googleapis.com/css?family=Poppins:400,500,600",
  "/User/../WINGO/gameassets/css/gateway.css",
  "/User/../WINGO/gameassets/css/gatewaystyle.css"
],
  inlineCss,
  tailwind: true,
  htmlStyle: "",
  bodyStyle: "",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function PayOnlineView(props: Record<string, any>) {
  const { amount, finalUrl, payAddress } = props;
  
  return (
    <>
      {" "}{/* PHP: _Init() */}{" "}<input type="hidden" id="payAddress" defaultValue={payAddress} />{" "}<div className="d-flex flex-column flex-center" style={{ margin: "0 auto" } as CSS}>{" "}<div style={{ width: "100%", height: "60px", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 15px", position: "fixed", top: "0", left: "0", zIndex: "1000", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" } as CSS}>{" "}<div onClick={() => window.history.back()} style={{ cursor: "pointer", display: "flex", alignItems: "center", color: "#000" } as CSS}>{" "}<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{" "}<polyline points="15 18 9 12 15 6" />{" "}</svg>{" "}</div>{" "}<div style={{ color: "#000", fontSize: "18px" } as CSS}>{"Online Deposit"}</div>{" "}<div style={{ width: "24px" } as CSS} />{" "}</div>{" "}<div style={{ paddingTop: "80px" } as CSS} />{" "}<div className="d-flex flex-row flex-center" id="kt_login" style={{ margin: "0 auto" } as CSS}>{" "}<div className="d-flex flex-center bgi-size-cover bgi-no-repeat flex-row flex-column">{" "}<div className="text-center p-7 position-relative">{" "}<div className="card card-size border">{" "}<div className="card-body">{" "}<div style={{ display: "none" } as CSS} id="dvsuccess">{" "}<div className="alert alert-custom alert-light-danger fade show mb-5" role="alert" style={{ margin: "2rem 2rem 0 2rem" } as CSS}>{" "}<div className="alert-icon">{"🛑"}</div>{" "}<div className="alert-text">{"Your transaction Successfully complete"}</div>{" "}</div>{" "}<a className="btn btn-xs btn-light-danger font-weight-bold" href="/recharge" style={{ marginBottom: "2.25rem" } as CSS}>{"Go Back"}</a>{" "}</div>{" "}<div className="" style={{ display: "none" } as CSS} id="dvcancel">{" "}<div className="alert alert-custom alert-light-danger fade show mb-5" role="alert" style={{ margin: "2rem 2rem 0 2rem" } as CSS}>{" "}<div className="alert-icon">{"🛑"}</div>{" "}<div className="alert-text" id="txtcanmsg">{"Your transaction cancel Successfully"}</div>{" "}</div>{" "}<a className="btn btn-xs btn-light-danger font-weight-bold" href="/recharge" style={{ marginBottom: "2.25rem" } as CSS}>{"Go Back"}</a>{" "}</div>{" "}<div className="alert-text" style={{ marginTop: "10%", color: "red", fontWeight: "700", marginLeft: "1%", marginRight: "1%" } as CSS}>{"* Don't go back immediately after making payment.After completing the USDT transaction,please backfill Txn Hash/Transaction ID (12digits). If you do not back fill the Txn Hash, 100% of the deposit transaction will fail. Please be sure to backfill!"}</div>{" "}<div className="login-signin">{" "}<div className="mb-0" style={{ padding: "2.25rem 2.25rem 0 2.25rem", borderBottom: "1px solid #f2f4f9" } as CSS}>{" "}<h3>{APP_NAME}</h3>{" "}<p className="opacity-60 font-weight-bold">{"Transfer to"}</p>{" "}</div>{" "}<div className="d-flex flex-row" style={{ width: "100%", borderBottom: "1px solid #f2f4f9" } as CSS}>{" "}<div className="flex-center" ref={important("width: 50% !important")} style={{ margin: "auto" } as CSS}>{" "}<h4>{"Total Amount"}</h4>{" "}</div>{" "}<div className="flex-center" ref={important("width: 50% !important")} style={{ padding: "1.25rem 0", borderLeft: "1px solid #f2f4f9" } as CSS}>{" "}<h2 style={{ margin: "0" } as CSS}>{amount}{" USDT"}</h2>{" "}</div>{" "}</div>{" "}<div>{" "}<div className="text-dark font-weight-bold input" style={{ marginBlock: ".5rem" } as CSS}>{" "}<span id="upi" className="form-control">{payAddress}</span>{" "}</div>{" "}<div className="button flex align-center upicopy">{" "}<button className="btn btn-success" data-todo-onclick="copyToClipboard1()">{"copy"}</button>{" "}</div>{" "}</div>{" "}<div style={{ display: "flex", justifyContent: "center", marginBlock: "1rem" } as CSS}>{" "}<canvas id="qrcode" />{" "}</div>{" "}<span className="d-flex flex-row opacity-75 timeout-text" style={{ borderTop: "1px solid #f2f4f9" } as CSS}>{" "}<div className="flex-center" ref={important("width: 60% !important;height: 100% !important")} style={{ margin: "auto", padding: "0 2.25rem" } as CSS}>{" Expire in "}<strong className="text-dark" id="base-timer-label" style={{ padding: "1.25rem 0" } as CSS} />{" "}</div>{" "}<div className="flex-center" ref={important("width: 40% !important;height: 100% !important")} style={{ padding: "1.25rem 0", borderLeft: "1px solid #f2f4f9" } as CSS}>{" "}<button className="btn btn-xs btn-light-danger font-weight-bold" id="cancel_txn_btn_qrcode" data-todo-onclick="cancel()">{"Go Back"}</button>{" "}</div>{" "}</span>{" "}<div className="part2 flex align-center" id="upi-pay-btn">{" "}<a className="btn btn-xs btn-light-primary font-weight-bold" id="btnpay" href={finalUrl} target="_blank" rel="noopener noreferrer" style={{ marginBlock: ".5rem" } as CSS}>{" Check Status "}</a>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div className="text-center position-relative" style={{ padding: "0 1.75rem 1rem", margin: "0 auto", width: "100%" } as CSS}>{" QR by "}<img src={LOGO} alt="" style={{ height: "24px" } as CSS} />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<input type="hidden" id="hdCounterOne" defaultValue="300" />{" "}
    </>
  );
}
