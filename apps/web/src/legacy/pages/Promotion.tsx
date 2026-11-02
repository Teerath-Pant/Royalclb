/* Generated from User/promotion.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go, formatAmount, important } from "../php";
import inlineCss from "./css/Promotion.css?raw";

const DEFAULTS: Record<string, any> = {
  "promotionLinks": [
    {
      "title": "Today Register Team",
      "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALvSURBVHgB7Zg9bxNBEIbfuWAsoVhEooIGU9HwzQ+I01ARBRGJGkQBCIHoKHFKOiKBEAWyqJAiIVkKPXRUxJagScWlgQZCAhQEsJd318b44+7sOWPOie6RTr7zzu3N7OzuzA6QkpKyrREMgXmIAns4x2uOXeWb/1ZhYK8FuQYfIyaWAaaEKfzAHb5+q4/kPeymIZewEdh6H/uQwVl4WMVerMgF9qrEgxKn/E950V95C2Uo694J7AxZd9VwjCbOmiWaq0RtgBt5gxMDy1tZ561e5Abe0wNPMYGvqNMbmzgFJaopxDmfhyfvEIe6meGaeBnY72Pk8AvnnTcEy3IFHzAgOg94KCIudrGHNV2mB2p46x4MB0mlkkoJOY64iMxFttdao56HAp0BmrnfSz6q0a2HBjko0C/iMUNrwBriU41qdDGhwUcoUE4hU0ZcjEQawAhwpCGHdSjQroEhDKgvhDYtYZJx4LB7+ILXUKAywO3jIovQYmQxLC9yym9itvn4Rm5zS1WgX8SZepF7enVgeSub5TsBuHn/GfPcQnPU5BMj9gqUqA1wiVnGzAzkCY68lQ1L5lq5EEce3/FcbmILSoZNp5laeEXe2fjwJ8itUfEy53w5LHVISUlJ2Tn03UbbKg/TfOTZVqYav1qMzz3f5439fTLIFmvuItcvMoca4PZ4QYkBq4DR4DePmT7Cv3+Gt/a0tizX8S1ILjASmwc8uHhSGaHyFnu+rrhvBVGj4hNu9HPYhfm2dLuDHg80D+4VxJomsdigJ04GecKVWdZxmrdHqekWD/7Puj3R6wHP1nz+m/Jw35qQUlCDLXTJVbyiGasuZ8pwPXbRYYBbsMpD9T/BoND8djCTNMJ6oI4D5hH2tzd1esDDRSRFVNnFlhxDyi6dBhgcRFKITEe2/y27RHhA5BCSI3rd7WnFg2z7392LODkP9DMg1zzsSGcBeJzqQEGtErvJtoD247UgKTZcQb4SA6/r0QjuVMVvlJSUsac37bv1wTQ3N6aAAAAAElFTkSuQmCC",
      "link": "/new-registrations"
    },
    {
      "title": "Direct Team Details",
      "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALvSURBVHgB7Zg9bxNBEIbfuWAsoVhEooIGU9HwzQ+I01ARBRGJGkQBCIHoKHFKOiKBEAWyqJAiIVkKPXRUxJagScWlgQZCAhQEsJd318b44+7sOWPOie6RTr7zzu3N7OzuzA6QkpKyrREMgXmIAns4x2uOXeWb/1ZhYK8FuQYfIyaWAaaEKfzAHb5+q4/kPeymIZewEdh6H/uQwVl4WMVerMgF9qrEgxKn/E950V95C2Uo694J7AxZd9VwjCbOmiWaq0RtgBt5gxMDy1tZ561e5Abe0wNPMYGvqNMbmzgFJaopxDmfhyfvEIe6meGaeBnY72Pk8AvnnTcEy3IFHzAgOg94KCIudrGHNV2mB2p46x4MB0mlkkoJOY64iMxFttdao56HAp0BmrnfSz6q0a2HBjko0C/iMUNrwBriU41qdDGhwUcoUE4hU0ZcjEQawAhwpCGHdSjQroEhDKgvhDYtYZJx4LB7+ILXUKAywO3jIovQYmQxLC9yym9itvn4Rm5zS1WgX8SZepF7enVgeSub5TsBuHn/GfPcQnPU5BMj9gqUqA1wiVnGzAzkCY68lQ1L5lq5EEce3/FcbmILSoZNp5laeEXe2fjwJ8itUfEy53w5LHVISUlJ2Tn03UbbKg/TfOTZVqYav1qMzz3f5439fTLIFmvuItcvMoca4PZ4QYkBq4DR4DePmT7Cv3+Gt/a0tizX8S1ILjASmwc8uHhSGaHyFnu+rrhvBVGj4hNu9HPYhfm2dLuDHg80D+4VxJomsdigJ04GecKVWdZxmrdHqekWD/7Puj3R6wHP1nz+m/Jw35qQUlCDLXTJVbyiGasuZ8pwPXbRYYBbsMpD9T/BoND8djCTNMJ6oI4D5hH2tzd1esDDRSRFVNnFlhxDyi6dBhgcRFKITEe2/y27RHhA5BCSI3rd7WnFg2z7392LODkP9DMg1zzsSGcBeJzqQEGtErvJtoD247UgKTZcQb4SA6/r0QjuVMVvlJSUsac37bv1wTQ3N6aAAAAAElFTkSuQmCC",
      "link": "/direct"
    },
    {
      "title": "All Team Details",
      "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALvSURBVHgB7Zg9bxNBEIbfuWAsoVhEooIGU9HwzQ+I01ARBRGJGkQBCIHoKHFKOiKBEAWyqJAiIVkKPXRUxJagScWlgQZCAhQEsJd318b44+7sOWPOie6RTr7zzu3N7OzuzA6QkpKyrREMgXmIAns4x2uOXeWb/1ZhYK8FuQYfIyaWAaaEKfzAHb5+q4/kPeymIZewEdh6H/uQwVl4WMVerMgF9qrEgxKn/E950V95C2Uo694J7AxZd9VwjCbOmiWaq0RtgBt5gxMDy1tZ561e5Abe0wNPMYGvqNMbmzgFJaopxDmfhyfvEIe6meGaeBnY72Pk8AvnnTcEy3IFHzAgOg94KCIudrGHNV2mB2p46x4MB0mlkkoJOY64iMxFttdao56HAp0BmrnfSz6q0a2HBjko0C/iMUNrwBriU41qdDGhwUcoUE4hU0ZcjEQawAhwpCGHdSjQroEhDKgvhDYtYZJx4LB7+ILXUKAywO3jIovQYmQxLC9yym9itvn4Rm5zS1WgX8SZepF7enVgeSub5TsBuHn/GfPcQnPU5BMj9gqUqA1wiVnGzAzkCY68lQ1L5lq5EEce3/FcbmILSoZNp5laeEXe2fjwJ8itUfEy53w5LHVISUlJ2Tn03UbbKg/TfOTZVqYav1qMzz3f5439fTLIFmvuItcvMoca4PZ4QYkBq4DR4DePmT7Cv3+Gt/a0tizX8S1ILjASmwc8uHhSGaHyFnu+rrhvBVGj4hNu9HPYhfm2dLuDHg80D+4VxJomsdigJ04GecKVWdZxmrdHqekWD/7Puj3R6wHP1nz+m/Jw35qQUlCDLXTJVbyiGasuZ8pwPXbRYYBbsMpD9T/BoND8djCTNMJ6oI4D5hH2tzd1esDDRSRFVNnFlhxDyi6dBhgcRFKITEe2/y27RHhA5BCSI3rd7WnFg2z7392LODkP9DMg1zzsSGcBeJzqQEGtErvJtoD247UgKTZcQb4SA6/r0QjuVMVvlJSUsac37bv1wTQ3N6aAAAAAElFTkSuQmCC",
      "link": "/team"
    },
    {
      "title": "Income Details",
      "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALvSURBVHgB7Zg9bxNBEIbfuWAsoVhEooIGU9HwzQ+I01ARBRGJGkQBCIHoKHFKOiKBEAWyqJAiIVkKPXRUxJagScWlgQZCAhQEsJd318b44+7sOWPOie6RTr7zzu3N7OzuzA6QkpKyrREMgXmIAns4x2uOXeWb/1ZhYK8FuQYfIyaWAaaEKfzAHb5+q4/kPeymIZewEdh6H/uQwVl4WMVerMgF9qrEgxKn/E950V95C2Uo694J7AxZd9VwjCbOmiWaq0RtgBt5gxMDy1tZ561e5Abe0wNPMYGvqNMbmzgFJaopxDmfhyfvEIe6meGaeBnY72Pk8AvnnTcEy3IFHzAgOg94KCIudrGHNV2mB2p46x4MB0mlkkoJOY64iMxFttdao56HAp0BmrnfSz6q0a2HBjko0C/iMUNrwBriU41qdDGhwUcoUE4hU0ZcjEQawAhwpCGHdSjQroEhDKgvhDYtYZJx4LB7+ILXUKAywO3jIovQYmQxLC9yym9itvn4Rm5zS1WgX8SZepF7enVgeSub5TsBuHn/GfPcQnPU5BMj9gqUqA1wiVnGzAzkCY68lQ1L5lq5EEce3/FcbmILSoZNp5laeEXe2fjwJ8itUfEy53w5LHVISUlJ2Tn03UbbKg/TfOTZVqYav1qMzz3f5439fTLIFmvuItcvMoca4PZ4QYkBq4DR4DePmT7Cv3+Gt/a0tizX8S1ILjASmwc8uHhSGaHyFnu+rrhvBVGj4hNu9HPYhfm2dLuDHg80D+4VxJomsdigJ04GecKVWdZxmrdHqekWD/7Puj3R6wHP1nz+m/Jw35qQUlCDLXTJVbyiGasuZ8pwPXbRYYBbsMpD9T/BoND8djCTNMJ6oI4D5hH2tzd1esDDRSRFVNnFlhxDyi6dBhgcRFKITEe2/y27RHhA5BCSI3rd7WnFg2z7392LODkP9DMg1zzsSGcBeJzqQEGtErvJtoD247UgKTZcQb4SA6/r0QjuVMVvlJSUsac37bv1wTQ3N6aAAAAAElFTkSuQmCC",
      "link": "/wallet"
    },
    {
      "title": "Subordinate Data",
      "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALvSURBVHgB7Zg9bxNBEIbfuWAsoVhEooIGU9HwzQ+I01ARBRGJGkQBCIHoKHFKOiKBEAWyqJAiIVkKPXRUxJagScWlgQZCAhQEsJd318b44+7sOWPOie6RTr7zzu3N7OzuzA6QkpKyrREMgXmIAns4x2uOXeWb/1ZhYK8FuQYfIyaWAaaEKfzAHb5+q4/kPeymIZewEdh6H/uQwVl4WMVerMgF9qrEgxKn/E950V95C2Uo694J7AxZd9VwjCbOmiWaq0RtgBt5gxMDy1tZ561e5Abe0wNPMYGvqNMbmzgFJaopxDmfhyfvEIe6meGaeBnY72Pk8AvnnTcEy3IFHzAgOg94KCIudrGHNV2mB2p46x4MB0mlkkoJOY64iMxFttdao56HAp0BmrnfSz6q0a2HBjko0C/iMUNrwBriU41qdDGhwUcoUE4hU0ZcjEQawAhwpCGHdSjQroEhDKgvhDYtYZJx4LB7+ILXUKAywO3jIovQYmQxLC9yym9itvn4Rm5zS1WgX8SZepF7enVgeSub5TsBuHn/GfPcQnPU5BMj9gqUqA1wiVnGzAzkCY68lQ1L5lq5EEce3/FcbmILSoZNp5laeEXe2fjwJ8itUfEy53w5LHVISUlJ2Tn03UbbKg/TfOTZVqYav1qMzz3f5439fTLIFmvuItcvMoca4PZ4QYkBq4DR4DePmT7Cv3+Gt/a0tizX8S1ILjASmwc8uHhSGaHyFnu+rrhvBVGj4hNu9HPYhfm2dLuDHg80D+4VxJomsdigJ04GecKVWdZxmrdHqekWD/7Puj3R6wHP1nz+m/Jw35qQUlCDLXTJVbyiGasuZ8pwPXbRYYBbsMpD9T/BoND8djCTNMJ6oI4D5hH2tzd1esDDRSRFVNnFlhxDyi6dBhgcRFKITEe2/y27RHhA5BCSI3rd7WnFg2z7392LODkP9DMg1zzsSGcBeJzqQEGtErvJtoD247UgKTZcQb4SA6/r0QjuVMVvlJSUsac37bv1wTQ3N6aAAAAAElFTkSuQmCC",
      "link": "/team-report"
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
  "/User/assets/css/page-wallet-d7e3e5ae.css"
],
  inlineCss,
  tailwind: false,
  htmlStyle: "font-size:36px;",
  bodyStyle: "font-size: 12px;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function PromotionView(props: Record<string, any>) {
  const { currentPage, promotionLinks = DEFAULTS.promotionLinks, referralCode, referralUrl, stats } = props;
  
  return (
    <>
      {" "}<div id="app" data-v-app="">{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.back()} />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-2f448113="" className="navbar__content-title" style={{ color: "#FDE4BC" } as CSS}>{"Promotion Management"}</div>{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.forward()} />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-f28a8f7b="" data-v-8ccc2c7e="" className="container" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif" } as CSS}>{" "}<div data-v-f28a8f7b="" className="amount" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" } as CSS}>{" "}<span style={{ cursor: "pointer" } as CSS}>{" ₹"}{formatAmount(stats?.yesterdayCommission ?? 0)}{" "}</span>{" "}<a href="/commission" style={{ fontSize: "11px", color: "#ffffff", background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)", padding: "3px 8px", borderRadius: "12px", textDecoration: "none", fontWeight: "500", display: "inline-flex", alignItems: "center", gap: "3px", border: "1px solid rgba(255, 255, 255, 0.2)", verticalAlign: "middle" } as CSS}>{" View Report › "}</a>{" "}</div>{" "}<div data-v-f28a8f7b="" className="amount_txt">{" "}<strong ref={important("color: #110D14 !important")} style={{ fontWeight: "bold" } as CSS}>{"Yesterday's total commission"}</strong>{" "}</div>{" "}<div data-v-f28a8f7b="" className="info_content">{" "}<div data-v-f28a8f7b="" className="info">{" "}<div data-v-f28a8f7b="" className="head">{"Direct Team"}</div>{" "}<div data-v-f28a8f7b="" className="line1">{" "}<div data-v-f28a8f7b="">{String((stats?.totalSponser ?? 0))}</div>{" Direct Team Register "}</div>{" "}<div data-v-f28a8f7b="" className="line3">{" "}<div data-v-f28a8f7b="" />{" Direct Team Deposit "}</div>{" "}<div data-v-f28a8f7b="" className="line1">{" "}<div data-v-f28a8f7b="" />{" ₹"}{formatAmount(stats?.totalDirectDeposit ?? 0)}{" "}</div>{" "}</div>{" "}<div data-v-f28a8f7b="" className="info">{" "}<div data-v-f28a8f7b="" className="head">{"Total Team"}</div>{" "}<div data-v-f28a8f7b="" className="line1">{" "}<div data-v-f28a8f7b="">{String((stats?.totalTeam ?? 0))}</div>{" Team Register "}</div>{" "}<div data-v-f28a8f7b="" className="line3">{" "}<div data-v-f28a8f7b="" />{" Team Deposit Amount "}</div>{" "}<div data-v-f28a8f7b="" className="line1">{" "}<div data-v-f28a8f7b="" />{" ₹"}{formatAmount(stats?.totalTeamDeposit ?? 0)}{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div data-v-8ccc2c7e="" className="content" style={{ "--80613dcc": "'Roboto', 'Inter', sans-serif", padding: "10px", marginBottom: "2rem" } as CSS}>{" "}<div data-v-8ccc2c7e="" className="shareBtnContainer">{" "}<button data-v-8ccc2c7e="" className="shareBtn btn copyBtn" data-clipboard-text={referralUrl}>{" INVITATION LINK "}</button>{" "}</div>{" "}<div data-v-8ccc2c7e="" className="promote__cell">{" "}<div data-v-8ccc2c7e="" className="promote__cell-item">{" "}<div data-v-8ccc2c7e="" className="label">{" "}<img data-v-8ccc2c7e="" src="/User/assets/png/invite_icon.png" alt="Invite" />{" "}<span data-v-8ccc2c7e="">{"Copy Invitation Code"}</span>{" "}</div>{" "}<div data-v-8ccc2c7e="" className="arrow">{" "}<span data-v-8ccc2c7e="" className="value">{referralCode}</span>{" "}<button className="btn copyBtn" data-clipboard-text={referralUrl} style={{ margin: "0", padding: "0", border: "none", background: "none" } as CSS}>{" "}<img data-v-8ccc2c7e="" src="/User/assets/png/deposite-i.png" alt="Copy" />{" "}</button>{" "}</div>{" "}</div>{" "}{promotionLinks.map((item: any, _i: number) => {  return (<Fragment key={_i}>{" "}<div data-v-8ccc2c7e="" className="promote__cell-item" onClick={() => go(item?.link)}>{" "}<div data-v-8ccc2c7e="" className="label">{" "}<img data-v-8ccc2c7e="" src={item?.icon} alt={item?.title} />{" "}<span data-v-8ccc2c7e="">{item?.title}</span>{" "}</div>{" "}<div data-v-8ccc2c7e="" className="arrow">{" "}<img data-v-8ccc2c7e="" src="/User/assets/png/right.png" alt="Arrow" />{" "}</div>{" "}</div>{" "}</Fragment>); })}{" "}</div>{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}</div>{" "}<div role="dialog" tabIndex={0} className="van-popup van-popup--center van-toast van-toast--middle van-toast--success" style={{ zIndex: "2001", display: "none" } as CSS} id="copymsg">{" "}<i className="van-badge__wrapper van-icon van-icon-success van-toast__icon" />{" "}<div className="van-toast__text">{"Copy successful"}</div>{" "}</div>{" "}
    </>
  );
}
