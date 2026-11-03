/** Animal Roulette. Same markup and round logic as animal/index.php + js/main.js, as one React page. */
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@/lib/api";
import { notyf } from "@/lib/notyf";
import { profileQuery } from "@/queries/profile";
import { LegacyPage } from "@/legacy/use-legacy";
import type { LegacyStyles } from "@/legacy/use-legacy";

import { A, AmountChips, ConfettiBanner, FullscreenButton, Navbar, WalletBox } from "../chrome";
import { showConfetti } from "../confetti";
import { createOnce, fetchWalletTotal, placeBetRequest, useRoundSocket } from "../shared";
import type { RoundMessage } from "../shared";
import { useFullscreen } from "../use-fullscreen";
import pageCss from "./page.css?raw";

const BASE = "/games/animal";
const css = (name: string) => `${BASE}/css/${name}`;

const legacy: LegacyStyles = {
  stylesheets: [css("app.21328c5b.css"), css("chunk-9ca7d0dc.0f968705.css"), css("chunk-f7aaa136.30c67545.css"), css("chunk-vendors.b521b44f.css"), css("animal.css"), css("loader.css"), "/styles/notyf.min.css", "/styles/helpers.css"],
  inlineCss: pageCss,
  htmlStyle: "font-size: 37.52px;",
  bodyStyle: "font-size: 12px;",
  dpr: "0.5",
};

const AMOUNTS = [10, 50, 100, 200, 500];
const CIRCLES = 14;
type Animal = "TIGER" | "SNAKE" | "SHARK" | "FOX" | "CHEETAH" | "BEAR" | "WHALE" | "LION";

/** Which wheel positions belong to each animal. */
const CIRCLE_OPTIONS: Record<Animal, number[]> = {
  TIGER: [8, 14],
  SNAKE: [1],
  SHARK: [7, 13],
  FOX: [5, 11],
  CHEETAH: [3, 9],
  BEAR: [4, 10],
  WHALE: [2],
  LION: [6, 12],
};

const ROWS: { cls: string; animal: Animal; multiplier: string }[][] = [
  [
    { cls: "tigerbox", animal: "TIGER", multiplier: "2x" },
    { cls: "snakebox", animal: "SNAKE", multiplier: "3x" },
    { cls: "sharkbox", animal: "SHARK", multiplier: "4x" },
    { cls: "foxbox", animal: "FOX", multiplier: "6x" },
  ],
  [
    { cls: "chettahbox", animal: "CHEETAH", multiplier: "8x" },
    { cls: "bearbox", animal: "BEAR", multiplier: "10x" },
    { cls: "whalebox", animal: "WHALE", multiplier: "12x" },
    { cls: "lionbox", animal: "LION", multiplier: "20x" },
  ],
];

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]!;

function Game() {
  const profile = useQuery(profileQuery).data;

  const [seconds, setSeconds] = useState("00");
  const [records, setRecords] = useState<string[]>([]);
  const [totals, setTotals] = useState<Partial<Record<Animal, number>>>({});
  const [wallet, setWallet] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number | null>(null);
  const [flash, setFlash] = useState<number | null>(null);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const { fullscreen, portrait, supported, toggle } = useFullscreen();

  // The page CSS hides the body until the original script's DOMContentLoaded handler revealed it.
  useEffect(() => {
    document.body.style.visibility = "visible";
  }, []);

  const gameId = useRef<number | null>(null);
  const settle = useRef<((position: number) => void) | null>(null);
  const banner = useRef<HTMLDivElement>(null);
  const bannerText = useRef<HTMLHeadingElement>(null);

  const refreshWallet = useCallback(async () => {
    try {
      setWallet(`₹ ${(await fetchWalletTotal()).toFixed(2)}`);
    } catch (error) {
      console.error(error);
    }
  }, []);
  const refreshTotals = useCallback(async () => {
    if (gameId.current) {
      setTotals(await api(`/animal/${gameId.current}/total-bet`));
    }
  }, []);
  const refreshRecords = useCallback(async () => {
    try {
      const data = await api<{ data: { result: string }[] }>("/animal/game-history?page=1&interval=0.5&limit=5");
      setRecords(data.data.map((r) => r.result));
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Spins the wheel one position every 100ms; returns the setter for the stop position. */
  const runLoop = useCallback(() => {
    let result: number | null = null;
    let i = 0;
    const timer = setInterval(() => {
      setActive(i);
      i = (i + 1) % CIRCLES;
      if (result !== null && i === result) {
        clearInterval(timer);
        setTimeout(() => setActive(-1), 5000);
      }
    }, 100);
    return (position: number) => {
      result = position;
    };
  }, []);

  const steps = useRef<ReturnType<typeof makeSteps>>(null as never);
  function makeSteps() {
    const onListen = createOnce(() => void refreshTotals());
    const onBetStart = createOnce(() => {
      void refreshRecords();
      settle.current = null;
      void refreshWallet();
      void refreshTotals();
      onCalculationStart.reset();
      onCalculationBeforeEnd.reset();
      onCalculationEnd.reset();
    });
    const onCalculationStart = createOnce(() => {
      settle.current = runLoop();
      setLoading(true);
      onBetStart.reset();
    });
    const onCalculationBeforeEnd = createOnce(() => {
      void api<{ result: Animal }>(`/animal/result?id=${gameId.current}`)
        .then(({ result }) => settle.current?.(pick(CIRCLE_OPTIONS[result])))
        .catch(console.error);
      onBetStart.reset();
    });
    const onCalculationEnd = createOnce(() => {
      setLoading(false);
      if (gameId.current) {
        void api<{ status: string }>(`/animal/get-result/${gameId.current}`).then((data) => {
          if (data.status !== "no-bet") {
            showConfetti(data.status as "win" | "lose", banner.current, bannerText.current);
          }
        });
      }
      onBetStart.reset();
    });
    return { onListen, onBetStart, onCalculationStart, onCalculationBeforeEnd, onCalculationEnd };
  }
  steps.current ??= makeSteps();

  useRoundSocket(
    "/animal",
    "game_animal",
    ({ id, timerSec, timerMin, gameStatus }: RoundMessage) => {
      gameId.current = id;
      const s = steps.current;
      s.onListen.run();
      if (gameStatus === "betting") {
        setSeconds(String(timerSec).padStart(2, "0"));
        s.onBetStart.run();
      } else {
        if (timerMin === 0 && timerSec <= 5 && timerSec > 2) {
          s.onCalculationStart.run();
        }
        if (timerMin === 0 && timerSec <= 2 && timerSec > 0) {
          s.onCalculationBeforeEnd.run();
        }
        if (timerMin === 0 && timerSec === 0) {
          s.onCalculationEnd.run();
        }
      }
    },
    "0.5"
  );

  const chooseAmount = (amount: number) => {
    setBetAmount(betAmount === amount ? null : amount);
    setFlash(amount);
    setTimeout(() => setFlash(null), 200);
  };

  const bet = async (on: Animal) => {
    if (!betAmount) {
      notyf.error("Please select an amount first.");
      return;
    }
    await placeBetRequest("/animal/", { gameId: gameId.current, betAmount, betOn: on });
    void refreshWallet();
    void refreshTotals();
  };

  const walletText = wallet ?? `₹ ${profile?.totalWallet ?? ""}`;

  return (
    <>
      <ConfettiBanner bannerRef={banner} headingRef={bannerText} />
      <div className={`loading-wave${loading ? "" : " hide"}`}>
        <div className="loading-bar" />
        <div className="loading-bar" />
        <div className="loading-bar" />
        <div className="loading-bar" />
      </div>
      <div id="rotateMessage" style={{ display: portrait ? "block" : "none" }} />
      <div id="app">
        <div className="mian game" {...A}>
          <Navbar base={BASE} seconds={seconds} />
          <div className="game-head" {...A}>
            <FullscreenButton base={BASE} fullscreen={fullscreen} supported={supported} onClick={() => void toggle()} />
            <div className="game-container">
              <div className="buttons">
                <button className="hide">Show Dragon</button>
                <button className="hide">Show Tiger</button>
                <button className="hide">Show Tie</button>
              </div>
              <div className="main-div">
                <div className="row-4">
                  <div className="ellipse-container" id="ellipse">
                    <div className="panda d-none">
                      <img src={`${BASE}/images/PANDA.png`} alt="" style={{ width: "100px", position: "relative" }} />
                    </div>
                    {Array.from({ length: CIRCLES }, (_, i) => (
                      <div key={i} className={`circle circle-${i}${active === i ? " active" : ""}`} />
                    ))}
                  </div>
                </div>
                <div className="row-8 main-table">
                  <div className="col p-22">
                    {ROWS.map((row, r) => (
                      <div key={r} className="row-6 p-3">
                        {row.map(({ cls, animal, multiplier }) => (
                          <div key={animal} className={`col-3 ${cls}`} onClick={() => void bet(animal)}>
                            <span className="ammount">{totals[animal] ?? 0}</span>
                            <div className="xamount">
                              <span className="text-effect">{multiplier}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <WalletBox text={walletText} />
              <AmountChips amounts={AMOUNTS} selected={betAmount} flash={flash} onPick={chooseAmount} trailingSpace />
              <div className="recordd" style={{ position: "absolute", right: "10px", top: "40px" }}>
                <div className="container">
                  <div className="record-container">
                    <div className="record-btn">Record</div>
                    <div className="icon-list">
                      {records.map((record, i) => (
                        <div key={i} className={`icon ${record.toLowerCase()}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function Animal() {
  return (
    <LegacyPage legacy={legacy}>
      <Game />
    </LegacyPage>
  );
}
