/* Generated from User/about.php. Markup is the PHP template; data arrives as props. */
/* oxlint-disable typescript/no-explicit-any */
import { Fragment } from "react";
import type { CSSProperties as CSS } from "react";

import { LegacyFooter } from "../footer";
import { go } from "../php";
import inlineCss from "./css/About.css?raw";

const DEFAULTS: Record<string, any> = {};

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
  bodyStyle: "font-size: 12px; background-color: #241e22; color: #FDE4BC;",
};

// oxlint-disable-next-line typescript/no-explicit-any
export function AboutView(props: Record<string, any>) {
  const { currentPage } = props;
  
  return (
    <>
      {" "}<div id="app" data-v-app="" style={{ padding: "0 .32rem .32rem" } as CSS}>{" "}<div data-v-3949aac6="" data-v-b67ac651="" className="navbar">{" "}<div data-v-3949aac6="" className="navbar-fixed" style={{ background: "linear-gradient(90deg, rgb(56, 46, 53) 0%, rgb(56, 46, 53) 100%)" } as CSS}>{" "}<div data-v-3949aac6="" className="navbar__content">{" "}<div data-v-3949aac6="" className="navbar__content-left">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.back()} />{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-center">{" "}<div data-v-2f448113="" className="navbar__content-title" style={{ color: "#FDE4BC" } as CSS}>{"About Us"}</div>{" "}</div>{" "}<div data-v-3949aac6="" className="navbar__content-right">{" "}<div data-v-3949aac6="" className="backIcon" onClick={() => window.history.forward()} />{" "}</div>{" "}</div>{" "}</div>{" "}</div>{" "}<div style={{ paddingTop: "60px", paddingBottom: "100px", lineHeight: "1.6", fontSize: "14px" } as CSS}>{" "}<h1 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px", color: "#ffd84d" } as CSS}>{"About Royal Club"}</h1>{" "}<p style={{ marginBottom: "15px" } as CSS}><strong>{"Royal Club"}</strong>{" is a rapidly growing next-generation gaming company focused on creating an innovative and engaging digital gaming ecosystem for users worldwide."}</p>{" "}<p style={{ marginBottom: "15px" } as CSS}>{"With a diverse portfolio of gaming experiences including "}<strong>{"Colour Prediction, Aviator, Casino, Arcade, and other interactive games"}</strong>{", Royal Club is committed to delivering an exciting, seamless, and technology-driven gaming experience."}</p>{" "}<img src="/User/images/current_team.jpeg" alt="Current Team" style={{ width: "100%", borderRadius: "10px", marginBottom: "15px", marginTop: "5px" } as CSS} />{" "}<img src="/User/images/head_of_marketing.jpeg" alt="Head of Marketing" style={{ width: "100%", borderRadius: "10px", marginBottom: "15px", marginTop: "5px" } as CSS} />{" "}<h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", marginTop: "20px", color: "#ffd84d" } as CSS}>{"Backed by Leading Gaming & Digital Companies"}</h2>{" "}<p style={{ marginBottom: "15px" } as CSS}>{"Royal Club has received investment and strategic backing from some of the recognized names in the global gaming and digital-asset industry, including:"}</p>{" "}<h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "5px", color: "#ffd84d" } as CSS}>{"GALA GAMES"}</h3>{" "}<p style={{ marginBottom: "15px" } as CSS}>{"A leading blockchain gaming ecosystem known for developing and supporting innovative Web3 gaming experiences."}</p>{" "}<h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "5px", color: "#ffd84d" } as CSS}>{"NAKAMOTO GAMES"}</h3>{" "}<p style={{ marginBottom: "15px" } as CSS}>{"A Web3 gaming ecosystem focused on blockchain-powered games and decentralized gaming experiences."}</p>{" "}<h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "5px", color: "#ffd84d" } as CSS}>{"ROBINHOOD"}</h3>{" "}<p style={{ marginBottom: "15px" } as CSS}>{"A well-known digital financial services platform with a strong presence in the modern digital-asset ecosystem."}</p>{" "}<h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "5px", color: "#ffd84d" } as CSS}>{"KUCOIN"}</h3>{" "}<p style={{ marginBottom: "15px" } as CSS}>{"A globally recognized cryptocurrency exchange and digital-asset platform serving users across international markets."}</p>{" "}<p style={{ marginBottom: "15px" } as CSS}>{"The participation and investment of these established industry names represent strong confidence in "}<strong>{"Royal Club's vision, technology, and long-term growth potential"}</strong>{"."}</p>{" "}<h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", marginTop: "20px", color: "#ffd84d" } as CSS}>{"Our Vision"}</h2>{" "}<p style={{ marginBottom: "15px" } as CSS}>{"Our vision is to establish Royal Club as a globally recognized gaming ecosystem where "}<strong>{"technology, entertainment, innovation, and digital gaming"}</strong>{" come together."}</p>{" "}<p style={{ marginBottom: "15px" } as CSS}>{"We continuously work to expand our gaming portfolio, improve platform technology, and introduce new experiences for our growing community."}</p>{" "}<h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", marginTop: "20px", color: "#ffd84d" } as CSS}>{"Our Mission"}</h2>{" "}<p style={{ marginBottom: "15px" } as CSS}>{"Our mission is to build a reliable, innovative, and user-focused gaming platform that delivers high-quality gaming experiences while continuously evolving with the global gaming and Web3 industry."}</p>{" "}<h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "5px", color: "#ffd84d" } as CSS}>{"Royal Club — The Future of Digital Gaming"}</h3>{" "}<p style={{ marginBottom: "15px" } as CSS}><strong>{"Play. Innovate. Experience."}</strong></p>{" "}<p style={{ marginBottom: "15px" } as CSS}>{"Royal Club is building more than a gaming platform — we are building a next-generation gaming ecosystem designed for the future."}</p>{" "}</div>{" "}</div>{" "}<LegacyFooter current={currentPage} />{" "}
    </>
  );
}
