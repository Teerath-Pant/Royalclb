/** Pieces every game page shares: the round socket, the wallet, fullscreen and the "run once per round" guard. */
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

import { api, apiPost } from "@/lib/api";
import { notyf } from "@/lib/notyf";

export type RoundMessage = {
  id: number;
  periodId?: string;
  timerMin: number;
  timerSec: number;
  gameStatus: "betting" | "calculating";
};

/** Same as the original `createOnceFunction`: `run` fires the callback once until `reset`. */
export function createOnce(callback: () => void) {
  let ran = false;
  return {
    run() {
      if (!ran) {
        ran = true;
        callback();
      }
    },
    reset() {
      ran = false;
    },
  };
}

/**
 * Joins a game's socket room and calls `onRound` for every tick. The room is the page's `data-dpr`
 * value, which is how the PHP pages picked their round length.
 */
export function useRoundSocket(namespace: string, eventPrefix: string, onRound: (message: RoundMessage) => void, fallbackInterval: string) {
  const handler = useRef(onRound);
  handler.current = onRound;

  useEffect(() => {
    const socket: Socket = io(namespace, { path: "/api/socket.io" });
    const interval = document.documentElement.getAttribute("data-dpr") ?? fallbackInterval;
    const event = `${eventPrefix}_${interval}`;

    socket.on("connect", () => {
      socket.emit("join-room", interval);
      socket.off(event);
      socket.on(event, (message: RoundMessage) => handler.current(message));
    });
    return () => {
      socket.emit("leave-room", interval);
      socket.off(event);
      socket.disconnect();
    };
  }, [namespace, eventPrefix, fallbackInterval]);
}

/** The wallet line: wallet + fund + bonus, as the PHP scripts summed it. */
export async function fetchWalletTotal() {
  const w = await api<{ wallet: string; fundWallet: string; bonusWallet: string }>("/user/wallets");
  return Number(w.wallet) + Number(w.fundWallet) + Number(w.bonusWallet);
}

/** Posts a bet and toasts the server's message, like the original `handleApi`. */
export async function placeBetRequest(path: string, body: Record<string, unknown>) {
  try {
    const res = await apiPost(path, body);
    notyf.success(res.message);
    return true;
  } catch (error) {
    notyf.error(error instanceof Error ? error.message : "Something went wrong");
    return false;
  }
}

export const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
