/** Dragon vs Tiger. Same markup and round logic as dragon-tiger/index.php + js/main.js, as one React page. */
import { useQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";

import { api } from "@/lib/api";
import { notyf } from "@/lib/notyf";
import { profileQuery } from "@/queries/profile";
import { LegacyPage } from "@/legacy/use-legacy";
import type { LegacyStyles } from "@/legacy/use-legacy";

import { A, AmountChips, ConfettiBanner, FullscreenButton, Navbar, WalletBox } from "../chrome";
import { showConfetti } from "../confetti";
import { createOnce, fetchWalletTotal, placeBetRequest, randomBetween, useRoundSocket } from "../shared";
import type { RoundMessage } from "../shared";
import { useFullscreen } from "../use-fullscreen";
import pageCss from "./page.css?raw";

const BASE = "/games/dragon-tiger";
const css = (name: string) => `${BASE}/css/${name}`;

const legacy: LegacyStyles = {
  stylesheets: [
    css("app.21328c5b.css"),
    css("chunk-9ca7d0dc.0f968705.css"),
    css("chunk-f7aaa136.30c67545.css"),
    css("chunk-vendors.b521b44f.css"),
    "/styles/notyf.min.css",
    css("dragon-tiger.css"),
  ],
  inlineCss: pageCss,
  htmlStyle: "font-size: 37.52px;",
  bodyStyle: "font-size: 12px;",
  dpr: "0.5",
};

const CARDS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const AMOUNTS = [10, 50, 100, 200, 500];
type Side = "DRAGON" | "TIGER" | "TIE";
type TotalBet = { dragonBet: number; tigerBet: number; tieBet: number };

const img = (file: string) => `${BASE}/images/${file}`;


function Game() {
  const profile = useQuery(profileQuery).data;

  const [seconds, setSeconds] = useState("00");
  const [history, setHistory] = useState<Side[]>([]);
  const [totals, setTotals] = useState<TotalBet>({ dragonBet: 0, tigerBet: 0, tieBet: 0 });
  const [wallet, setWallet] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number | null>(null);
  const [betOn, setBetOn] = useState<Side | null>(null);
  const [cards, setCards] = useState({ dragon: "card.png", tiger: "card2.png" });
  const [flash, setFlash] = useState<number | null>(null);
  const { fullscreen, portrait, supported, toggle } = useFullscreen();

  const gameId = useRef<number | null>(null);
  const banner = useRef<HTMLDivElement>(null);
  const bannerText = useRef<HTMLHeadingElement>(null);
  const winImages = useRef<(HTMLDivElement | null)[]>([]);
  const stopShuffle = useRef<((dragon: number, tiger: number) => void) | null>(null);

  const refreshWallet = useCallback(async () => {
    try {
      setWallet(`₹ ${(await fetchWalletTotal()).toFixed(2)}`);
    } catch (error) {
      console.error(error);
    }
  }, []);
  const refreshTotals = useCallback(async () => {
    try {
      setTotals(await api<TotalBet>(`/dragon-tiger/total-bet?gameId=${gameId.current}`));
    } catch (error) {
      console.error(error);
    }
  }, []);
  const refreshHistory = useCallback(async () => {
    const interval = document.documentElement.getAttribute("data-dpr") ?? "0.5";
    const data = await api<{ data: { result: Side }[] }>(`/dragon-tiger/game-history?page=1&interval=${interval}&limit=10`);
    setHistory(data.data.map((d) => d.result));
  }, []);

  /** The winner's image grows in, stays three seconds, then fades out. */
  const showResultImage = useCallback((result: Side) => {
    const el = winImages.current[{ DRAGON: 0, TIGER: 1, TIE: 2 }[result]];
    if (!el) {
      return;
    }
    el.style.display = "block";
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "scale(1)";
    }, 10);
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => {
        el.style.display = "none";
        el.style.transform = "scale(0.2)";
      }, 1000);
    }, 3000);
  }, []);

  /** Cycles random cards every 100ms until the result arrives; returns the function that settles them. */
  const shuffleCards = useCallback(() => {
    const timer = setInterval(() => {
      setCards({
        dragon: `B-${CARDS[Math.floor(Math.random() * CARDS.length)]}.png`,
        tiger: `R-${CARDS[Math.floor(Math.random() * CARDS.length)]}.png`,
      });
    }, 100);
    return (dragon: number, tiger: number) => {
      clearInterval(timer);
      setCards({ dragon: `B-${CARDS[dragon]}.png`, tiger: `R-${CARDS[tiger]}.png` });
      setTimeout(() => setCards({ dragon: "card.png", tiger: "card2.png" }), 5000);
    };
  }, []);

  // The round steps run once each, like the original once-guards.
  const steps = useRef<ReturnType<typeof makeSteps>>(null as never);
  function makeSteps() {
    const onBetStart = createOnce(() => {
      void refreshTotals();
      void refreshHistory();
      stopShuffle.current = null;
      onCalculatingStart.reset();
      onCalculatingBeforeEnd.reset();
      onCalculatingEnd.reset();
    });
    const onCalculatingStart = createOnce(() => {
      stopShuffle.current = shuffleCards();
    });
    const onCalculatingBeforeEnd = createOnce(() => {
      void api<{ result: Side }>(`/dragon-tiger/result?id=${gameId.current}`)
        .then(({ result }) => {
          showResultImage(result);
          let dragon = -1;
          let tiger = -1;
          if (result === "DRAGON") {
            dragon = randomBetween(2, 11);
            tiger = randomBetween(1, dragon - 1);
          } else if (result === "TIGER") {
            tiger = randomBetween(2, 11);
            dragon = randomBetween(1, tiger - 1);
          } else {
            dragon = randomBetween(1, 11);
            tiger = dragon;
          }
          stopShuffle.current?.(dragon, tiger);
        })
        .catch(console.error)
        .finally(() => {
          stopShuffle.current = null;
        });
    });
    const onCalculatingEnd = createOnce(() => {
      if (gameId.current) {
        void api<{ status: string }>(`/dragon-tiger/get-result/${gameId.current}`).then((data) => {
          if (data.status !== "no-bet") {
            showConfetti(data.status as "win" | "lose", banner.current, bannerText.current);
          }
        });
      }
      onBetStart.reset();
    });
    return { onBetStart, onCalculatingStart, onCalculatingBeforeEnd, onCalculatingEnd };
  }
  steps.current ??= makeSteps();

  useRoundSocket(
    "/dt",
    "game_dt",
    ({ id, timerSec, timerMin, gameStatus }: RoundMessage) => {
      gameId.current = id;
      const s = steps.current;
      if (gameStatus === "betting") {
        s.onBetStart.run();
        setSeconds(String(timerSec).padStart(2, "0"));
      }
      if (timerMin === 0 && gameStatus === "calculating") {
        if (timerSec <= 5 && timerSec > 2) {
          s.onCalculatingStart.run();
        }
        if (timerSec <= 2 && timerSec > 0) {
          s.onCalculatingBeforeEnd.run();
        }
        if (timerSec === 0) {
          s.onCalculatingEnd.run();
        }
      }
    },
    "0.5"
  );

  const chooseAmount = (amount: number) => {
    if (betAmount === amount) {
      setBetAmount(null);
      setBetOn(null);
    } else {
      setBetAmount(amount);
    }
    setFlash(amount);
    setTimeout(() => setFlash(null), 200);
  };

  const chooseSide = async (side: Side) => {
    if (!betAmount) {
      notyf.error("Please select an amount first.");
      return;
    }
    setBetOn(side);
    await placeBetRequest("/dragon-tiger/", { gameId: gameId.current, betAmount, betOn: side });
    void refreshWallet();
    void refreshTotals();
    setBetOn(null);
  };

  const walletText = wallet ?? `₹ ${profile?.totalWallet ?? ""}`;
  const frame = (side: Side, total: number, file: string) => (
    <div className={`col-4 main-frame${betOn === side ? " active" : ""}`} onClick={() => void chooseSide(side)}>
      <span className="frame-num">{total}</span>
      <img src={img(file)} alt="" width="115px" />
    </div>
  );

  return (
    <>
      <ConfettiBanner bannerRef={banner} headingRef={bannerText} />
      <div id="rotateMessage" style={{ display: portrait ? "block" : "none" }} />
      <div id="app">
        <div className="mian game" {...A}>
          <Navbar base={BASE} seconds={seconds} />
          <div className="game-head" {...A}>
            <FullscreenButton base={BASE} fullscreen={fullscreen} supported={supported} onClick={() => void toggle()} />
            <div className="game-container">
              <div className="buttons">
                <button style={{ display: "none" }}>Show Dragon</button>
                <button style={{ display: "none" }}>Show Tiger</button>
                <button style={{ display: "none" }}>Show Tie</button>
              </div>
              {(["dragon-win.png", "tiger-win.png", "tie-win.png"] as const).map((file, i) => (
                <div key={file} id={`imageContainer${i + 1}`} className="imageContainer" ref={(el) => void (winImages.current[i] = el)}>
                  <img src={img(file)} alt={`${["Dragon", "Tiger", "Tiger"][i]} Wins`} />
                </div>
              ))}
              <div style={{ marginBottom: "2rem" }}>
                <div className="row" style={{ display: "flex", justifyContent: "space-evenly" }}>
                  <div className="col card" style={{ padding: 0 }}>
                    <img src={img(cards.dragon)} alt="" width="42px" id="dragon-card" />
                  </div>
                  <div className="col card" style={{ padding: 0 }}>
                    <img src={img(cards.tiger)} alt="" width="42px" id="tiger-card" />
                  </div>
                </div>
                <div className="row-12" style={{ display: "flex", justifyContent: "center" }} id="history">
                  {history.map((result, i) => (
                    <div key={i} className={`col ${{ DRAGON: "d", TIGER: "t", TIE: "tie" }[result]}`} />
                  ))}
                </div>
                <div className="row frame">
                  {frame("DRAGON", totals.dragonBet, "dragon.png")}
                  {frame("TIE", totals.tieBet, "tie.png")}
                  {frame("TIGER", totals.tigerBet, "tiger.png")}
                </div>
              </div>
              <WalletBox text={walletText} />
              <AmountChips amounts={AMOUNTS} selected={betAmount} flash={flash} onPick={chooseAmount} />
            </div>
          </div>
          <div id="main-table" style={{ display: "none" }} />
        </div>
      </div>
    </>
  );
}

export function DragonTiger() {
  return (
    <LegacyPage legacy={legacy}>
      <Game />
    </LegacyPage>
  );
}
