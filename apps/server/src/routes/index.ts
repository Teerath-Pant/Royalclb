import type { FastifyInstance, FastifyPluginCallback } from "fastify";

import { config } from "@/config";

import { andarBaharRouter } from "./andar-bahar";
import { animalRouter } from "./animal";
import { attendanceRouter } from "./attendance";
import { authRouter } from "./auth";
import { aviatorRouter } from "./aviator";
import { carRouletteRouter } from "./car-roulette";
import { chickenRoadRouter } from "./chicken-road";
import { cryptoTradeRouter } from "./crypto-trade";
import { dragonTigerRouter } from "./dragon-tiger";
import { fundRouter } from "./fund";
import { gameSettingsRouter } from "./game-settings";
import { giftCodeRouter } from "./gift-code";
import { incomeRouter } from "./income";
import { k3Router } from "./k3";
import { linksRouter } from "./links";
import { lotterySpinRouter } from "./lottery-spin";
import { lucky100Router } from "./lucky-100";
import { safeRouter } from "./safe";
import { settingsRouter } from "./settings";
import { sevenUpDownRouter } from "./seven-up-down";
import { spinRouter } from "./spin";
import { supportRouter } from "./support";
import { upiRouter } from "./upi";
import { userRouter } from "./user";
import { walletAddressRouter } from "./wallet-address";
import { winGoRouter } from "./win-go";
import { withdrawalRouter } from "./withdrawal";
import { withdrawalMethodsRouter } from "./withdrawal-methods";

const staticRouters: { router: FastifyPluginCallback; prefix: string }[] = [
  { router: authRouter, prefix: "/auth" },
  { router: userRouter, prefix: "/user" },
  { router: linksRouter, prefix: "/links" },
  { router: gameSettingsRouter, prefix: "/game-settings" },
  { router: settingsRouter, prefix: "/settings" },
  { router: fundRouter, prefix: "/fund" },
  { router: upiRouter, prefix: "/upi" },
  { router: walletAddressRouter, prefix: "/wallet-address" },
  { router: giftCodeRouter, prefix: "/gift-codes" },
  { router: safeRouter, prefix: "/safe" },
  { router: withdrawalMethodsRouter, prefix: "/withdrawal-methods" },
  { router: withdrawalRouter, prefix: "/withdrawal" },
  { router: incomeRouter, prefix: "/income" },
  { router: attendanceRouter, prefix: "/attendance" },
  { router: supportRouter, prefix: "/support" },
];

const allowedGames = config("games");

const gameRouters: {
  name: keyof typeof allowedGames;
  router: FastifyPluginCallback;
  prefix: string;
}[] = [
  { name: "aviator", router: aviatorRouter, prefix: "/aviator" },
  { name: "spin", router: spinRouter, prefix: "/spin" },
  { name: "k3", router: k3Router, prefix: "/k3" },
  { name: "lottery_spin", router: lotterySpinRouter, prefix: "/lottery-spin" },
  {
    name: "seven_up_down",
    router: sevenUpDownRouter,
    prefix: "/seven-up-down",
  },
  { name: "dragon_tiger", router: dragonTigerRouter, prefix: "/dragon-tiger" },
  { name: "win_go", router: winGoRouter, prefix: "/win-go" },
  { name: "lucky_100", router: lucky100Router, prefix: "/lucky-100" },
  { name: "crypto_trade", router: cryptoTradeRouter, prefix: "/crypto-trade" },
  { name: "car_roulette", router: carRouletteRouter, prefix: "/car-roulette" },
  { name: "animal", router: animalRouter, prefix: "/animal" },
  { name: "andar_bahar", router: andarBaharRouter, prefix: "/andar-bahar" },
  { name: "chicken_road", router: chickenRoadRouter, prefix: "/chicken-road" },
];

export async function appRouter(app: FastifyInstance) {
  for (const { router, prefix } of staticRouters) {
    await app.register(router, { prefix });
  }

  for (const { name, router, prefix } of gameRouters) {
    if (allowedGames[name]) {
      await app.register(router, { prefix });
    }
  }
}
