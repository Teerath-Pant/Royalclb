const _config = {
  uidStart: 10_000,
  incomes: {
    trade_commission: true,
    referral_level: true,
  },
  games: {
    aviator: true,
    spin: false,
    k3: true,
    lottery_spin: false,
    seven_up_down: false,
    dragon_tiger: true,
    win_go: true,
    lucky_100: false,
    crypto_trade: false,
    car_roulette: false,
    animal: true,
    andar_bahar: false,
    chicken_road: false,
  },
};

type Config = typeof _config;

type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${Path<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

type PathValue<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? PathValue<T[K], Rest>
      : never
    : never;

export function config<P extends Path<Config>>(path: P): PathValue<Config, P> {
  const parts = path.split(".");
  let result: unknown = _config;

  for (const part of parts) {
    if (result === undefined) {
      throw new Error(`Cannot access ${part} of undefined`);
    }

    if (typeof result !== "object" || result === null) {
      throw new Error(`Cannot access ${part} of non-object`);
    }

    // TypeScript needs help here - we've verified result is an object
    result = (result as Record<string, unknown>)[part];
  }

  return result as PathValue<Config, P>;
}
