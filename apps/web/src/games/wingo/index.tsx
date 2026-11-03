/** Win Go. Same markup and round logic as WINGO/index.php + js/index.js + js/utils.js, as one React page. */
import { useQuery } from "@tanstack/react-query";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FC, ReactNode } from "react";
import { io } from "socket.io-client";

import { api } from "@/lib/api";
import { notyf } from "@/lib/notyf";
import { go } from "@/legacy/php";
import { LegacyPage } from "@/legacy/use-legacy";
import type { LegacyStyles } from "@/legacy/use-legacy";
import { profileQuery } from "@/queries/profile";

import { createOnce, fetchWalletTotal, placeBetRequest } from "../shared";
import type { RoundMessage } from "../shared";
import pageCss from "./page.css?raw";

const BASE = "/games/wingo";

const legacy: LegacyStyles = {
  stylesheets: [
    `${BASE}/css/modules-13a75a76.css`,
    `${BASE}/css/page-home-a56adcdf.css`,
    `${BASE}/css/index-f60748c8.css`,
    `${BASE}/css/reset-7899187d.css`,
    "/styles/notyf.min.css",
  ],
  inlineCss: pageCss,
  htmlStyle: "font-size: 54px",
  bodyStyle: "font-size: 12px",
  dpr: "0.5",
};

const INTERVALS = [0.5, 1, 3, 5];
const QUANTITIES = [1, 5, 10, 20, 50, 100];
const BALANCES = [10, 100, 1000, 10000];
const LOGO = "/assets/images/logo.webp";

/** The page CSS was built by Vue, so its rules are scoped to these data-v attributes. */
const v = (id: string) => ({ [`data-v-${id}`]: "" });
const Font = "font" as unknown as FC<{ color: string; children?: ReactNode }>;

type Tab = "game" | "chart" | "my";
type BetOn = string | number | null;
type Page<T> = { data: T[]; currentPage: number; totalPages: number };

type GameRow = { period: string; winNumber: number };
type BetRow = {
  id: number;
  number: number | null;
  color: string | null;
  bigSmall: string | null;
  status: string;
  dateTime: string;
  betAmount: string;
  winAmount: string;
  netWinAmount: string;
  charge: string;
  winGo: { period: string; winNumber: number };
};
type WinResult = { status: string; winNumber: number; netAmount: string; period: string };

const label = (interval: number) => (interval < 1 ? `${interval * 60} Sec` : `${interval} Min`);
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const pad2 = (n: number) => n.toString().trim().padStart(2, "0");

function humanDate(iso: string) {
  const text = new Date(iso).toLocaleString("en-IN", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  return text.replace(/\b(am|pm)\b/, (m) => m.toUpperCase());
}

/** Same as the original `usePagination`: one page at a time, ignoring a request while one is in flight. */
function usePager<T>(fetchPage: (page: number) => Promise<Page<T>>) {
  const [view, setView] = useState<Page<T> | null>(null);
  const page = useRef(1);
  const total = useRef(0);
  const busy = useRef(false);
  const fetcher = useRef(fetchPage);
  fetcher.current = fetchPage;

  const load = useCallback(async (target: number) => {
    if (busy.current) {
      return;
    }
    busy.current = true;
    try {
      const res = await fetcher.current(target);
      page.current = target;
      total.current = res.totalPages;
      setView(res);
    } catch (error) {
      console.error("Failed to fetch page:", error);
      setView({ data: [], currentPage: page.current, totalPages: 0 });
    } finally {
      busy.current = false;
    }
  }, []);

  return {
    view,
    load,
    previous: () => page.current !== 1 && void load(page.current - 1),
    next: () => page.current !== total.current && void load(page.current + 1),
  };
}

function Foot({ block, id, ids, view, onPrevious, onNext }: { block: string; id: string; ids: [string, string, string, string]; view: Page<unknown> | null; onPrevious: () => void; onNext: () => void }) {
  const [previous, current, total, next] = ids;
  return (
    <div {...v(id)} className={`${block}__C-foot`}>
      <div {...v(id)} className={`${block}__C-foot-previous${view?.currentPage === 1 ? " disabled" : ""}`} id={previous} onClick={onPrevious}>
        <i {...v(id)} className={`van-badge__wrapper van-icon van-icon-arrow-left ${block}__C-icon`} style={{ fontSize: "20px" }} />
      </div>
      <div {...v(id)} className={`${block}__C-foot-page`}>
        <span id={current}>{view ? (view.data.length !== 0 ? view.currentPage : 0) : ""}</span>/<span id={total}>{view ? view.totalPages : ""}</span>
      </div>
      <div {...v(id)} className={`${block}__C-foot-next${view && view.currentPage === view.totalPages ? " disabled" : ""}`} id={next} onClick={onNext}>
        <i {...v(id)} className={`van-badge__wrapper van-icon van-icon-arrow ${block}__C-icon`} style={{ fontSize: "20px" }} />
      </div>
    </div>
  );
}

function colorOf(winNumber: number) {
  if ([1, 3, 7, 9].includes(winNumber)) {
    return { dots: ["green"], className: "greenColor" };
  }
  if ([2, 4, 6, 8].includes(winNumber)) {
    return { dots: ["red"], className: "defaultColor" };
  }
  return winNumber === 5 ? { dots: ["green", "violet"], className: "mixedColor5" } : { dots: ["red", "violet"], className: "mixedColor0" };
}

function GameRows({ rows }: { rows: GameRow[] }) {
  return rows.map((d) => {
    const { dots, className } = colorOf(d.winNumber);
    return (
      <div key={d.period} {...v("4cca3a73")} className="van-row clsone_0">
        <div {...v("4cca3a73")} className="van-col van-col--8">
          {d.period}
        </div>
        <div {...v("4cca3a73")} className="van-col van-col--5 numcenter">
          <div {...v("4cca3a73")} className={`GameRecord__C-body-num ${className}`}>
            {d.winNumber}
          </div>
        </div>
        <div {...v("4cca3a73")} className="van-col van-col--5">
          <span {...v("4cca3a73")}>{d.winNumber > 4 ? "Big" : "Small"}</span>
        </div>
        <div {...v("4cca3a73")} className="van-col van-col--6">
          <div {...v("4cca3a73")} className="GameRecord__C-origin">
            {dots.map((dot) => (
              <div key={dot} {...v("4cca3a73")} className={`GameRecord__C-origin-I ${dot}`} />
            ))}
          </div>
        </div>
      </div>
    );
  });
}

function ChartRows({ rows }: { rows: GameRow[] }) {
  return rows.map((d, row) => {
    const big = d.winNumber > 4;
    const line = (
      <div {...v("ae0503ca")} className="van-row">
        <div {...v("ae0503ca")} className="van-col van-col--8">
          <div {...v("ae0503ca")} className="Trend__C-body2-IssueNumber">
            {d.period}
          </div>
        </div>
        <div {...v("ae0503ca")} className="van-col van-col--16">
          <div {...v("ae0503ca")} className="Trend__C-body2-Num">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} {...v("ae0503ca")} className={`Trend__C-body2-Num-item ${d.winNumber === i ? `action${i} chart-point` : ""}`}>
                {i}
              </div>
            ))}
            <div {...v("ae0503ca")} className={`Trend__C-body2-Num-BS ${big ? "isB" : ""}`}>
              {big ? "B" : "S"}
            </div>
          </div>
        </div>
      </div>
    );
    // The original template had an unterminated `</div`, which the HTML parser turned into a wrapper around the first row only.
    return row === 0 ? (
      <div key={d.period} {...v("ae0503ca")} className="cls_0">
        {line}
      </div>
    ) : (
      <Fragment key={d.period}>{line}</Fragment>
    );
  });
}

function Detail({ label: name, children, ...rest }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div {...v("2faec5cb")} className="MyGameRecordList__C-detail-line">
      <span {...v("2faec5cb")}>{name}</span>
      <div {...v("2faec5cb")} {...rest}>
        {children}
      </div>
    </div>
  );
}

function BetRows({ rows, openId, onToggle }: { rows: BetRow[]; openId: number; onToggle: (id: number) => void }) {
  return rows.map((d) => {
    const success = d.status === "WIN";
    const pending = d.status === "PENDING";
    const { winNumber } = d.winGo;
    const colors = [1, 3, 7, 9].includes(winNumber) ? ["green"] : [2, 4, 6, 8].includes(winNumber) ? ["red"] : winNumber === 0 ? ["red", "violet"] : ["green", "violet"];
    const big = winNumber > 4;
    const selected = d.number ?? d.color ?? d.bigSmall;
    const tone = success ? "green" : "red";
    return (
      <Fragment key={d.id}>
        <div {...v("2faec5cb")} className="MyGameRecordList__C-item" onClick={() => onToggle(d.id)}>
          <div {...v("2faec5cb")} className={`MyGameRecordList__C-item-l MyGameRecordList__C-item-l-${String(selected).toLowerCase()}`}>
            {d.number ?? d.color?.[0] ?? d.bigSmall}
          </div>
          <div {...v("2faec5cb")} className="MyGameRecordList__C-item-m">
            <div {...v("2faec5cb")} className="MyGameRecordList__C-item-m-top">
              {d.winGo.period}
            </div>
            <div {...v("2faec5cb")} className="MyGameRecordList__C-item-m-bottom">
              {humanDate(d.dateTime)}
            </div>
          </div>
          <div {...v("2faec5cb")} className={`MyGameRecordList__C-item-r ${success ? "success" : ""}`}>
            <div {...v("2faec5cb")} className={success ? "success" : ""} style={pending ? { color: "#ff9800", borderColor: "#ff9800" } : undefined}>
              {success ? "Succeed" : pending ? "Pending" : "Failed"}
            </div>
            <span {...v("2faec5cb")} style={pending ? { color: "#ff9800" } : undefined}>
              {success ? `+₹${d.netWinAmount}` : `-₹${d.betAmount}`}
            </span>
          </div>
        </div>
        <div {...v("2faec5cb")} className="MyGameRecordList__C-detail" style={openId === d.id ? undefined : { display: "none" }}>
          <div {...v("2faec5cb")} className="MyGameRecordList__C-detail-text">
            Details
          </div>
          <Detail label="Period">{d.winGo.period}</Detail>
          <Detail label="Purchase amount">₹{d.betAmount}</Detail>
          <Detail label="Quantity">{parseInt(d.betAmount)}</Detail>
          <Detail label="Result">
            <div {...v("2faec5cb")} className="MyGameRecordList__C-inlineB">
              {winNumber}
            </div>
            {colors.map((color) => (
              <div key={color} {...v("2faec5cb")} className={`MyGameRecordList__C-inlineB ${color}Color`}>
                {capitalize(color)}
              </div>
            ))}
            <div {...v("2faec5cb")} className={`MyGameRecordList__C-inlineB ${big ? "big" : "small"}`}>
              {big ? "Big" : "Small"}
            </div>
          </Detail>
          <Detail label="Select">{selected}</Detail>
          <Detail label="Status" className={tone}>
            {success ? "Succeed" : "Failed"}
          </Detail>
          <Detail label="Win/lose" className={tone}>
            {success ? `+₹${d.winAmount}` : `-₹${d.betAmount}`}
          </Detail>
          <Detail label="Tax">₹{d.charge}</Detail>
          <Detail label="Amount after tax" className="red">
            ₹{d.netWinAmount}
          </Detail>
          <Detail label="Order time">{humanDate(d.dateTime)}</Detail>
        </div>
      </Fragment>
    );
  });
}

function popupClass(betOn: BetOn) {
  if (betOn === 0) return "Betting__Popup-0";
  if (betOn === 5) return "Betting__Popup-5";
  if (betOn === "Red" || [2, 4, 6, 8].includes(betOn as number)) return "Betting__Popup-10";
  if (betOn === "Green" || [1, 3, 7, 9].includes(betOn as number)) return "Betting__Popup-11";
  if (betOn === "Violet") return "Betting__Popup-12";
  if (betOn === "Big") return "Betting__Popup-13";
  if (betOn === "Small") return "Betting__Popup-14";
  return "";
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function Game() {
  const profile = useQuery(profileQuery).data;
  const news = useQuery({ queryKey: ["home-news"], queryFn: () => api<{ news: string | null }>("/user/home") }).data?.news;

  const [interval, setIntervalValue] = useState(0.5);
  const [tab, setTab] = useState<Tab>("game");
  const [wallet, setWallet] = useState<string | null>(null);
  const [period, setPeriod] = useState("");
  const [clock, setClock] = useState("0000");
  const [countdown, setCountdown] = useState<{ visible: boolean; seconds: string }>({ visible: false, seconds: "05" });
  const [last5, setLast5] = useState<GameRow[]>([]);
  const [betOn, setBetOn] = useState<BetOn>(null);
  const [balance, setBalance] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [betModal, setBetModal] = useState(false);
  const [randomActive, setRandomActive] = useState(-1);
  const [howToPlay, setHowToPlay] = useState(false);
  const [win, setWin] = useState<{ visible: boolean; result: WinResult | null }>({ visible: false, result: null });
  const [openId, setOpenId] = useState(-1);
  const canvas = useRef<HTMLCanvasElement>(null);

  const intervalRef = useRef(0.5);
  const tabRef = useRef<Tab>("game");
  const gameId = useRef<number | null>(null);

  const q = (path: string, page: number, limit: number) => `/win-go/${path}?page=${page}&interval=${intervalRef.current}&limit=${limit}`;
  const games = usePager<GameRow>((page) => api(q("game-history", page, 10)));
  const chart = usePager<GameRow>((page) => api(q("chart-history", page, 10)));
  const bets = usePager<BetRow>((page) => api(q("bet-history", page, 10)));

  const refreshWallet = useCallback(async () => {
    try {
      setWallet(`₹${(await fetchWalletTotal()).toFixed(2)}`);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const loadLast5 = useCallback(async () => {
    const res = await api<Page<GameRow>>(`/win-go/game-history?page=1&interval=${intervalRef.current}&limit=5`);
    setLast5(res.data);
  }, []);

  const refreshHistory = useCallback(() => {
    const pager = { game: games, chart, my: bets }[tabRef.current];
    void pager.load(1);
  }, [games, chart, bets]);

  const showPopup = useCallback(async () => {
    if (gameId.current === null) {
      return;
    }
    const result = await api<WinResult>(`/win-go/get-result/${gameId.current}`);
    if (result.status === "no-bet") {
      return;
    }
    setWin({ visible: true, result });
    setTimeout(() => setWin((w) => ({ ...w, visible: false })), 5000);
  }, []);

  // Round steps and socket room, kept in a ref so the socket handler always runs the latest callbacks.
  const latest = useRef({ refreshHistory, refreshWallet, loadLast5, showPopup });
  latest.current = { refreshHistory, refreshWallet, loadLast5, showPopup };
  const changeGame = useRef<(next: number) => void>(() => {});

  useEffect(() => {
    const socket = io("/win-go", { path: "/api/socket.io" });
    let current: number | null = null;

    const onBet = createOnce(() => {
      setCountdown((c) => ({ ...c, visible: false }));
      latest.current.refreshHistory();
      void latest.current.refreshWallet();
      void latest.current.loadLast5();
      onCalculation.reset();
      onCalculationEnd.reset();
    });
    const onCalculation = createOnce(() => {
      setCountdown((c) => ({ ...c, visible: true }));
      setBetModal(false);
      onBet.reset();
    });
    const onCalculationEnd = createOnce(() => {
      void latest.current.showPopup();
    });

    const join = (next: number) => {
      if (current !== null) {
        socket.emit("leave-room", current);
        socket.off(`game_win_go_${current}`);
      }
      current = next;
      latest.current.refreshHistory();
      void latest.current.loadLast5();
      socket.emit("join-room", next);
      socket.on(`game_win_go_${next}`, ({ id, period: periodId, gameStatus, timerMin, timerSec }: RoundMessage & { period: string }) => {
        gameId.current = id;
        setPeriod(periodId);
        setClock(pad2(timerMin) + pad2(timerSec));
        if (gameStatus === "betting") {
          onBet.run();
        } else {
          setCountdown({ visible: true, seconds: pad2(timerSec) });
          onCalculation.run();
          setBetModal(false);
          if (timerMin === 0 && timerSec === 0) {
            onCalculationEnd.run();
          }
        }
      });
    };

    changeGame.current = join;
    socket.on("connect", () => join(intervalRef.current));
    return () => {
      socket.disconnect();
    };
  }, []);

  const changeInterval = (next: number) => {
    if (intervalRef.current === next) {
      return;
    }
    intervalRef.current = next;
    setIntervalValue(next);
    changeGame.current(next);
    setCountdown((c) => ({ ...c, visible: false }));
  };

  const changeTab = (next: Tab) => {
    if (tabRef.current === next) {
      return;
    }
    tabRef.current = next;
    setTab(next);
    refreshHistory();
  };

  const chooseBet = (on: BetOn) => {
    setBetOn(on);
    setBetModal(true);
  };

  const setQty = (value: unknown) => setQuantity(Number(value));
  const total = quantity * balance;

  const placeBet = async () => {
    const on = String(betOn).toUpperCase();
    if (total < 10) {
      notyf.error("Minimum bet amount is 10.");
      return;
    }
    const body: Record<string, unknown> = { gameId: gameId.current, betAmount: total };
    if (/^\d+$/.test(on)) {
      body.number = Number(on);
    } else if (["RED", "VIOLET", "GREEN"].includes(on)) {
      body.color = on;
    } else if (["BIG", "SMALL"].includes(on)) {
      body.bigSmall = on;
    } else {
      notyf.error("Invalid bet type.");
      return;
    }
    await placeBetRequest("/win-go/", body);
    void refreshWallet();
    if (tabRef.current === "my") {
      void bets.load(1);
    }
    setBetModal(false);
  };

  const random = async () => {
    const options = 10;
    for (let i = 0; i < 16; i++) {
      setRandomActive(Math.floor(Math.random() * options));
      await sleep(100);
    }
    const value = Math.floor(Math.random() * options);
    chooseBet(value);
    setRandomActive(-1);
  };

  // The trend line joins the winning numbers of the visible chart rows.
  useLayoutEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx || !chart.view || tab !== "chart") {
      return;
    }
    el.width = el.clientWidth;
    el.height = el.clientHeight;
    const box = el.getBoundingClientRect();
    ctx.beginPath();
    document.querySelectorAll(".chart-point").forEach((point, i) => {
      const r = point.getBoundingClientRect();
      const x = r.left - box.left + r.width / 2;
      const y = r.top - box.top + r.height / 2;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [chart.view, tab]);

  const walletText = wallet ?? `₹${profile?.totalWallet ?? ""}`;
  const result = win.result;
  const winColor = result ? ([1, 3, 7, 9].includes(result.winNumber) ? "Green" : [2, 4, 6, 8].includes(result.winNumber) ? "Red" : result.winNumber === 0 ? "Violet, Red" : "Violet, Green") : "";
  const winBonus = result ? (Number(result.netAmount) < 0 ? `-₹${Math.abs(Number(result.netAmount))}` : `+₹${result.netAmount}`) : "";

  return (
    <div id="app" data-v-app="">
      <audio controls src={`${BASE}/mp3/di1-0f3d86cb.mp3`} style={{ display: "none" }} />
      {[
        ["btnplay", "play", "pause"],
        ["btnplaythree", "playthree", "pausethree"],
        ["btnplayfive", "playfive", "pausefive"],
        ["btnplayten", "playten", "pauseten"],
      ].map(([id, play, pause]) => (
        <div key={id} className="action-btns" style={{ display: "none" }}>
          <button className={`btn ${play}`} id={id}>
            Play
          </button>
          <button className={`btn ${pause}`}>Pause</button>
        </div>
      ))}

      <div {...v("28738ead")} className="WinGo__C" style={{ "--d986150e": "'Roboto', 'Inter', sans-serif" } as React.CSSProperties}>
        <div {...v("2f448113")} {...v("28738ead")} className="navbar">
          <div {...v("2f448113")} className="navbar-fixed" style={{ background: "rgb(56, 46, 53)" }}>
            <div {...v("2f448113")} className="navbar__content">
              <a href="/home">
                <div {...v("2f448113")} className="navbar__content-left">
                  <i {...v("2f448113")} className="van-badge__wrapper van-icon van-icon-arrow-left" />
                </div>
              </a>
              <div {...v("2f448113")} className="navbar__content-center">
                <div {...v("2f448113")} className="headLogo" style={{ backgroundImage: `url('${LOGO}')` }} />
                <div {...v("2f448113")} className="navbar__content-title" />
              </div>
              <div {...v("2f448113")} className="navbar__content-right">
                <div {...v("28738ead")} className="WinGo__C-head-more" />
              </div>
            </div>
          </div>
        </div>

        <div {...v("5b319853")} {...v("28738ead")} className="Wallet__C">
          <div {...v("5b319853")} className="Wallet__C-balance">
            <div {...v("5b319853")} className="Wallet__C-balance-l2">
              <div {...v("5b319853")}>Wallet balance</div>
            </div>
            <div {...v("5b319853")} className="Wallet__C-balance-l1">
              <div id="spnwallet" {...v("5b319853")} onClick={() => void refreshWallet()}>
                {walletText}
              </div>
            </div>
            <div {...v("5b319853")} className="Wallet__C-balance-l3">
              <div {...v("5b319853")} onClick={() => go("/recharge")}>
                Deposit
              </div>
              <div {...v("5b319853")} onClick={() => go("/withdrawal")}>
                Withdraw
              </div>
            </div>
          </div>
        </div>

        <div style={{ paddingInline: ".32rem" }}>
          <div {...v("28738ead")} className="noticeBar__container">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" className="notice_svg">
              <path d="M15.2 14.4H9.19995C5.88624 14.4 3.19995 17.0863 3.19995 20.4V27.6C3.19995 30.9137 5.88624 33.6 9.19995 33.6H15.2V14.4Z" fill="#292929" />
              <path d="M15.2 14.55L32.229 7.74763C32.8858 7.48526 33.6 7.96901 33.6 8.67628V39.3237C33.6 40.031 32.8858 40.5147 32.229 40.2524L15.2 33.45" fill="#292929" />
              <path fillRule="evenodd" clipRule="evenodd" d="M38.5 17C38.5 16.1716 39.1715 15.5 40 15.5H42C42.8284 15.5 43.5 16.1716 43.5 17C43.5 17.8284 42.8284 18.5 42 18.5H40C39.1715 18.5 38.5 17.8284 38.5 17Z" fill="#292929" />
              <path fillRule="evenodd" clipRule="evenodd" d="M37.5 25C37.5 24.1716 38.1715 23.5 39 23.5H44C44.8284 23.5 45.5 24.1716 45.5 25C45.5 25.8284 44.8284 26.5 44 26.5H39C38.1715 26.5 37.5 25.8284 37.5 25Z" fill="#292929" />
              <path fillRule="evenodd" clipRule="evenodd" d="M38.5 33C38.5 32.1716 39.1715 31.5 40 31.5H42C42.8284 31.5 43.5 32.1716 43.5 33C43.5 33.8284 42.8284 34.5 42 34.5H40C39.1715 34.5 38.5 33.8284 38.5 33Z" fill="#292929" />
            </svg>
            <div className="noticeBar__container-body">
              <div className="noticeBar__container-body-text">
                <p>{news}</p>
              </div>
            </div>
          </div>
        </div>

        <div {...v("5aa99411")} {...v("28738ead")} className="GameList__C">
          {INTERVALS.map((value) => (
            <div key={value} {...v("5aa99411")} className={`GameList__C-item${interval === value ? " active" : ""}`} onClick={() => changeInterval(value)}>
              <div {...v("5aa99411")}>
                Win Go
                <br />
                <span>{label(value)}</span>
              </div>
            </div>
          ))}
        </div>

        <div id="dvmain">
          <div {...v("40fe88e0")} className="TimeLeft__C">
            <div {...v("40fe88e0")} className="TimeLeft__C-rule" id="howtoplayopen" onClick={() => setHowToPlay(true)}>
              How to play
            </div>
            <div {...v("40fe88e0")} className="TimeLeft__C-name">
              Win Go <span>{label(interval)}</span>
            </div>
            <div {...v("40fe88e0")} className="TimeLeft__C-num TimeLeft__C-numwin1" id="last5">
              {last5.map((d) => (
                <div key={d.period} {...v("40fe88e0")} className={`n${d.winNumber}`} />
              ))}
            </div>
            <div {...v("40fe88e0")} className="TimeLeft__C-id" id="spnPeriodCounterOne">
              {period}
            </div>
            <div {...v("40fe88e0")} className="TimeLeft__C-text">
              Time remaining
            </div>
            <div {...v("40fe88e0")} className="TimeLeft__C-time">
              <div {...v("40fe88e0")} id="timerMinuteOne">
                {clock[0]}
              </div>
              <div {...v("40fe88e0")} id="timerMinuteOne1">
                {clock[1]}
              </div>
              <div {...v("40fe88e0")}>:</div>
              <div {...v("40fe88e0")} id="timerSecondOne">
                {clock[2]}
              </div>
              <div {...v("40fe88e0")} id="timerSecondOne1">
                {clock[3]}
              </div>
            </div>
          </div>

          <div {...v("2194ac19")} {...v("28738ead")} className="Betting__C" {...{ voicetype: "1", typeid: "1" }}>
            <div {...v("2194ac19")} className={`Betting__C-mark${countdown.visible ? "" : " hide"}`} id="pnl_disableloaderOne">
              <div {...v("2194ac19")} id="txtdvfirstOne">
                {countdown.seconds[0]}
              </div>
              <div {...v("2194ac19")} id="txtdvsecondOne">
                {countdown.seconds[1]}
              </div>
            </div>
            <div {...v("2194ac19")} className="Betting__C-head">
              <div {...v("2194ac19")} className="Betting__C-head-g" onClick={() => chooseBet("Green")}>
                Green
              </div>
              <div {...v("2194ac19")} className="Betting__C-head-p" onClick={() => chooseBet("Violet")}>
                Violet
              </div>
              <div {...v("2194ac19")} className="Betting__C-head-r" onClick={() => chooseBet("Red")}>
                Red
              </div>
            </div>
            <div {...v("2194ac19")} className="Betting__C-numC">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} {...v("2194ac19")} className={`Betting__C-numC-item${i} option${randomActive === i ? " active" : ""}`} data-value={i} onClick={() => chooseBet(i)} />
              ))}
            </div>
            <div {...v("2194ac19")} className="Betting__C-multiple">
              <div {...v("2194ac19")} className="Betting__C-multiple-l" id="random-btn" onClick={() => void random()}>
                Random
              </div>
              {QUANTITIES.map((value) => (
                <div key={value} {...v("2194ac19")} className={`Betting__C-multiple-r${quantity === value ? " active" : ""}`} onClick={() => setQty(value)}>
                  {`X${value}`}
                </div>
              ))}
            </div>
            <div {...v("2194ac19")} className="Betting__C-foot">
              <div {...v("2194ac19")} className="Betting__C-foot-b clkm" onClick={() => chooseBet("Big")}>
                Big
              </div>
              <div {...v("2194ac19")} className="Betting__C-foot-s clkm" onClick={() => chooseBet("Small")}>
                Small
              </div>
            </div>

            <div {...v("dc81bf96")} className={`van-overlay${betModal ? "" : " hide"}`} style={{ zIndex: 2001 }} id="bet-overlay" onClick={() => setBetModal(false)} />
            <div {...v("dc81bf96")} role="dialog" tabIndex={0} className={`van-popup van-popup--round van-popup--bottom${betModal ? "" : " hide"}`} id="bet-modal" style={{ zIndex: 2001 }}>
              <div {...v("dc81bf96")} className={popupClass(betOn)}>
                <div {...v("dc81bf96")} className="Betting__Popup-head">
                  <div {...v("dc81bf96")} className="Betting__Popup-head-title">
                    <span className="cardheadr cardheadrone">{`Win Go ${interval < 1 ? `${interval * 60} Sec` : `${interval}Min`}`}</span>
                  </div>
                  <div {...v("dc81bf96")} className="Betting__Popup-head-selectName">
                    <span {...v("dc81bf96")}>Select</span>
                    <span {...v("dc81bf96")} className="lbl_headtextOne">
                      {betOn}
                    </span>
                  </div>
                </div>
                <div {...v("dc81bf96")} className="Betting__Popup-body">
                  <div {...v("dc81bf96")} className="Betting__Popup-body-line">
                    Balance
                    <div {...v("dc81bf96")} className="Betting__Popup-body-line-list">
                      {BALANCES.map((value) => (
                        <div key={value} {...v("dc81bf96")} className={`Betting__Popup-body-line-item${balance === value ? " bgcolor" : ""}`} onClick={() => setBalance(value)}>
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div {...v("dc81bf96")} className="Betting__Popup-body-line">
                    Quantity
                    <div {...v("dc81bf96")} className="Betting__Popup-body-line-btnL">
                      <div {...v("dc81bf96")} className="Betting__Popup-btn reduce bgcolor" onClick={() => quantity > 0 && setQuantity(quantity - 1)} />
                      <div {...v("dc81bf96")} className="van-cell van-field Betting__Popup-input">
                        <div className="van-cell__value van-field__value">
                          <div className="van-field__body">
                            <input type="text" inputMode="numeric" className="van-field__control" value={quantity} onChange={(e) => setQty(e.target.value.replace(/[^0-9]/g, ""))} />
                          </div>
                        </div>
                      </div>
                      <div {...v("dc81bf96")} className="Betting__Popup-btn bgcolor" onClick={() => setQuantity(quantity + 1)} />
                    </div>
                  </div>
                  <div {...v("dc81bf96")} className="Betting__Popup-body-line">
                    <div {...v("dc81bf96")} />
                    <div {...v("dc81bf96")} className="Betting__Popup-body-line-list">
                      {QUANTITIES.map((value) => (
                        <div key={value} {...v("dc81bf96")} className={`Betting__Popup-body-line-item checkguna${quantity === value ? " bgcolor" : ""}`} onClick={() => setQty(value)}>
                          {`X${value}`}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div {...v("dc81bf96")} className="Betting__Popup-body-line">
                    <span {...v("dc81bf96")} className="Betting__Popup-agree active">
                      I agree
                    </span>
                    <span {...v("dc81bf96")} className="Betting__Popup-preSaleShow">
                      《Pre-sale rules》
                    </span>
                  </div>
                </div>
                <div {...v("dc81bf96")} className="Betting__Popup-foot">
                  <div {...v("dc81bf96")} className="Betting__Popup-foot-c" id="bet-modal-cancel" onClick={() => setBetModal(false)}>
                    Cancel
                  </div>
                  <div {...v("dc81bf96")} className="Betting__Popup-foot-s bgcolor" id="bet-btn" onClick={() => void placeBet()}>
                    Total amount ₹
                    <label className="jkjkk" style={{ color: "#fff" }}>
                      <span>{total.toFixed(2)}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div {...v("a0861d49")} {...v("28738ead")} className="RecordNav__C">
              {(
                [
                  ["game", "Game history", "gamehistoryone"],
                  ["chart", "Chart", "chartone"],
                  ["my", "My history", "myhistoryone"],
                ] as const
              ).map(([name, text, id]) => (
                <div key={name} {...v("a0861d49")} className={`RecordNav__COne${tab === name ? " active" : ""}`} id={id} onClick={() => changeTab(name)}>
                  {text}
                </div>
              ))}
            </div>

            <div {...v("4cca3a73")} {...v("28738ead")} className="GameRecord__C" id="GameRecord__COne" style={tab === "game" ? undefined : { display: "none" }}>
              <div {...v("4cca3a73")} className="GameRecord__C-head">
                <div {...v("4cca3a73")} className="van-row">
                  <div {...v("4cca3a73")} className="van-col van-col--8">
                    Period
                  </div>
                  <div {...v("4cca3a73")} className="van-col van-col--5">
                    Number
                  </div>
                  <div {...v("4cca3a73")} className="van-col van-col--5">
                    Big Small
                  </div>
                  <div {...v("4cca3a73")} className="van-col van-col--6">
                    Color
                  </div>
                </div>
              </div>
              <div {...v("4cca3a73")} className="GameRecord__C-body" id="GameRecord__C-bodyOne">
                {games.view && <GameRows rows={games.view.data} />}
              </div>
              <Foot block="GameRecord" id="4cca3a73" ids={["game-previous", "dvpagesone1", "dvpagesone2", "game-next"]} view={games.view} onPrevious={games.previous} onNext={games.next} />
            </div>

            <div {...v("ae0503ca")} {...v("28738ead")} className="Trend__C" id="Trend__C_One" style={tab === "chart" ? undefined : { display: "none" }}>
              <div {...v("ae0503ca")} className="Trend__C-head">
                <div {...v("ae0503ca")} className="van-row">
                  <div {...v("ae0503ca")} className="van-col van-col--8">
                    Period
                  </div>
                  <div {...v("ae0503ca")} className="van-col van-col--16">
                    Number
                  </div>
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <canvas id="chart-canvas" className="chart-canvas" ref={canvas} />
                <div {...v("ae0503ca")} className="Trend__C-body2" id="Trend__C-body2">
                  {chart.view && <ChartRows rows={chart.view.data} />}
                </div>
              </div>
              <Foot block="Trend" id="ae0503ca" ids={["chart-previous", "dvpagestrend1", "dvpagestrend2", "chart-next"]} view={chart.view} onPrevious={chart.previous} onNext={chart.next} />
            </div>

            <div {...v("27897c55")} {...v("28738ead")} className="MyGameRecord__C" id="MyRecord__COne" style={tab === "my" ? undefined : { display: "none" }}>
              <div {...v("27897c55")} className="MyGameRecord__C-body">
                <div {...v("2faec5cb")} {...v("4b21e13b")} className="MyGameRecordList__C" id="betHistory">
                  {bets.view && <BetRows rows={bets.view.data} openId={openId} onToggle={(id) => setOpenId(openId === id ? -1 : id)} />}
                </div>
              </div>
              <Foot block="MyGameRecord" id="27897c55" ids={["bet-previous", "dvpagesmyrecord1", "dvpagesmyrecord2", "bet-next"]} view={bets.view} onPrevious={bets.previous} onNext={bets.next} />
            </div>
          </div>

          <div {...v("dc3f9366")} {...v("28738ead")} className={`WinningTip__C${win.visible ? "" : " hide"}`} id="winonemodal">
            <div {...v("dc3f9366")} className={`WinningTip__C-body${result?.status === "lose" ? " isL" : ""}`}>
              <div {...v("dc3f9366")} className="WinningTip__C-body-l1" id="Congratulations">
                {result ? (result.status === "lose" ? "Sorry" : "Congratulations") : ""}
              </div>
              <div {...v("dc3f9366")} className="WinningTip__C-body-l2" id="dvmainmodaldiv">
                Lottery results
                <div {...v("dc3f9366")} className="colorW" id="txtWinColor">
                  {winColor}
                </div>
                <div {...v("dc3f9366")} className="WinningNum" id="txtWinNumber">
                  {result?.winNumber}
                </div>
                <div {...v("dc3f9366")} className="colorW" id="txtWinSize">
                  {result ? (result.winNumber > 4 ? "Big" : "Small") : ""}
                </div>
              </div>
              <div {...v("dc3f9366")} className="WinningTip__C-body-l3">
                <div {...v("dc3f9366")} className="head">
                  Bonus
                </div>
                <div {...v("dc3f9366")} className="bonus" id="txtBonus">
                  {winBonus}
                </div>
                <div {...v("dc3f9366")} className="gameDetail" id="txtperiodcounterone">
                  {result?.period}
                </div>
              </div>
              <div {...v("dc3f9366")} className="WinningTip__C-body-l4" style={{ paddingLeft: "1.5rem" }}>
                3 seconds auto close
              </div>
              <div {...v("dc3f9366")} className="closeBtn" id="close-btn" onClick={() => setWin((w) => ({ ...w, visible: false }))} />
            </div>
          </div>

          <div {...v("79b922e1")} className={`van-overlay${howToPlay ? "" : " hide"}`} style={{ zIndex: 2001 }} id="howtoplay" onClick={() => setHowToPlay(false)} />
          <div {...v("79b922e1")} role="dialog" tabIndex={0} className={`van-popup van-popup--round van-popup--center${howToPlay ? "" : " hide"}`} id="howtoplaymodal" style={{ zIndex: 2003 }}>
            <div {...v("79b922e1")} className="TimeLeft__C-PreSale">
              <div {...v("79b922e1")} className="TimeLeft__C-PreSale-head">
                How to play
              </div>
              <div {...v("79b922e1")} className="TimeLeft__C-PreSale-body">
                <div {...v("79b922e1")}>
                  <div>
                    <Font color="#cec6ce">
                      <span>{interval < 1 ? `${interval * 60} seconds` : `${interval} minutes`}</span> 1 period, <span>{interval * 60 - 5}</span> seconds to order, 5 seconds waiting for the draw. It opens all day, the total number of purchases in a day is <span>{(24 * 60) / interval}</span> times.
                    </Font>
                  </div>
                  <Gap />
                  <Line>All the single bets will be have handling fee 2%.</Line>
                  <Line>For example bet 100 Rs after deduct the fee the exact betting amount will be 98 Rs.</Line>
                  <Gap />
                  <Line>Odds:</Line>
                  <Line>1. Select Green: if the result shows 1,3,7,9 the pay out is (98*2)=196 ; If the result shows 5, the pay out is (98*1.5) 147</Line>
                  <Gap />
                  <Line>2. Select Red: if the result shows 2,4,6,8 the pay out is (98*2)=196 ; If the result shows 0, the pay out is (98*1.5) 147</Line>
                  <Gap />
                  <Line>3. Select Violet: if the result shows 0 or 5, the pay out is (98*4.5)=441</Line>
                  <Gap />
                  <Line>4. Select Number: if the result is the same as the number you selected, the pay out is (98*9)=882</Line>
                  <Gap />
                  <Line>5. Select Big: if the result shows 5,6,7,8,9 the pay out is (98*2)=196</Line>
                  <Gap />
                  <Line>6. Select Small: if the result shows 0,1,2,3,4 the pay out is (98*2)=196</Line>
                  <Gap />
                  <Line>GAME RULES:</Line>
                  <div>
                    <Line wrap={false}>- It is not allowed to make 2-sided bets in 1 game period (For example: choosing green and red or big and small in the same period)</Line>
                    <Line wrap={false}>- To bet on numbers: the maximum total number that can be selected is 7 in 1 period (No more)</Line>
                  </div>
                  <Gap />
                  <div>
                    <br />
                  </div>
                </div>
              </div>
              <div {...v("79b922e1")} className="TimeLeft__C-PreSale-foot">
                <div {...v("79b922e1")} className="TimeLeft__C-PreSale-foot-btn" id="howtoplayclose" onClick={() => setHowToPlay(false)}>
                  Close
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Line({ children, wrap = true }: { children: ReactNode; wrap?: boolean }) {
  const text = <Font color="#cec6ce">{children}</Font>;
  return wrap ? <div>{text}</div> : text;
}

function Gap() {
  return (
    <div>
      <Font color="#cec6ce">
        <br />
      </Font>
    </div>
  );
}

export function WinGo() {
  return (
    <LegacyPage legacy={legacy}>
      <Game />
    </LegacyPage>
  );
}
