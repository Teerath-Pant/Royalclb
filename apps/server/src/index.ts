// oxlint-disable import/first
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

// Set the default timezone globally
dayjs.tz.setDefault("Asia/Kolkata");

import { setTimeout as sleep } from "node:timers/promises";

import type { Namespace } from "socket.io";
import { Server } from "socket.io";

import { app } from "@/app";
import { env } from "@/env";
// import { run7UpDown } from "@/games/7updown";
import { runDragonTiger } from "@/games/dragon-tiger";
import { runK3 } from "@/games/k3";
// import { runLS } from "@/games/lottery-spin";
// import { runLucky100 } from "@/games/lucky100";
// import { runTRX } from "./games/trx";
import { runWinGo } from "@/games/win-go";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { initSocketServer } from "@/sockets/socket.server";

import { crons } from "./cronjobs";
// import { runForexTrade } from "./games/forex-trade";
// import { runAndarBahar } from "./games/andar-bahar";
import { runAnimal } from "./games/animal";
import { runAviator } from "./games/aviator";
// import { runCarRoulette } from "./games/car-roulette";
// import { runCryptoTrade } from "./games/crypto-trade";

const { PORT } = env;

const io = new Server(app.server, {
  cors: {
    origin: "*",
  },
  path: "/socket.io",
});

const games = {
  K3: {
    namespace: io.of("/k3"),
    intervals: [1, 3, 5, 10],
    runFn: runK3,
  },
  // LS: { namespace: io.of("/ls"), intervals: [1], runFn: runLS },
  // UP_DOWN: {
  //   namespace: io.of("/7ud"),
  //   intervals: [0.5],
  //   runFn: run7UpDown,
  // },
  DRAGON_TIGER: {
    namespace: io.of("/dt"),
    intervals: [0.5],
    runFn: runDragonTiger,
  },
  WIN_GO: {
    namespace: io.of("/win-go"),
    intervals: [0.5, 1, 3, 5],
    runFn: runWinGo,
  },
  // LUCKY_100: {
  //   namespace: io.of("/lucky-100"),
  //   intervals: [5, 15, 30, 60],
  //   runFn: runLucky100,
  // },
  // CRYPTO_TRADE: {
  //   namespace: io.of("/ct"),
  //   intervals: [1],
  //   runFn: runCryptoTrade,
  // },
  // FOREX_TRADE: {
  //   namespace: io.of("/forex-trade"),
  //   intervals: [1],
  //   runFn: runForexTrade,
  // },
  // CAR_ROULETTE: {
  //   namespace: io.of("/cr"),
  //   intervals: [0.5],
  //   runFn: runCarRoulette,
  // },
  ANIMAL: {
    namespace: io.of("/animal"),
    intervals: [0.5],
    runFn: runAnimal,
  },
  // ANDAR_BAHAR: {
  //   namespace: io.of("/andar-bahar"),
  //   intervals: [0.5],
  //   runFn: runAndarBahar,
  // },
} as const;

export type GameType = keyof typeof games | "AVIATOR";

const aviatorNamespace = io.of("/aviator");
initSocketServer(aviatorNamespace, "AVIATOR", false);

for (const [game, { namespace }] of Object.entries(games)) {
  initSocketServer(namespace, game as GameType, true);
}

function runGames() {
  for (const { namespace, intervals, runFn } of Object.values(games)) {
    for (const interval of intervals) {
      void runFn({ io: namespace, interval });
    }
  }
}

void runAviator(aviatorNamespace);
runGames();

await app.listen({ port: PORT, host: "0.0.0.0" });

function disconnectSocketConnection(namespace: Namespace, name: GameType) {
  for (const socket of namespace.sockets.values()) {
    socket.disconnect(true);
    logger.info(`Socket ${socket.id} disconnected on ${name} Namespace`);
  }
}

async function cleanup() {
  logger.info("Cleaning up server...");

  io.emit("server:shutdown", { reason: "restart" });
  await sleep(1000);

  for (const [game, { namespace }] of Object.entries(games)) {
    disconnectSocketConnection(namespace, game as GameType);
  }
  for (const job of crons) {
    job.stop();
  }
  await io.close();
  await app.close();
  await prisma.$disconnect();

  logger.info("Cleanup complete.");
}

async function handleShutdown(by: string, code = 0) {
  logger.info(`Shutdown initiated... (BY: ${by})`);

  const forceExit = setTimeout(() => {
    logger.error("Cleanup timed out, forcing exit.");
    process.exit(1);
  }, 10_000);

  await cleanup();
  clearTimeout(forceExit);
  process.exit(code);
}

process.on("SIGINT", () => {
  void handleShutdown("SIGINT");
});
process.on("SIGTERM", () => {
  void handleShutdown("SIGTERM");
});

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught Exception:");
  void handleShutdown("uncaughtException", 1);
});

process.on("unhandledRejection", (err) => {
  logger.error({ err }, "Unhandled Rejection:");
  void handleShutdown("unhandledRejection", 1);
});
