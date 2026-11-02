import { Prisma, prisma } from "@/lib/prisma";
import type {
  updown_bets_bet_on,
  updown_bets,
  updown_games,
} from "@/lib/prisma";
import { getFundSettings } from "@/ops/fund-settings";
import { walletService } from "@/services/wallet.service";
import { Now } from "@/utils/date";

import { getMultipliers } from "./get-multipliers";

type HandleWinAndLose = {
  id: updown_games["id"];
  winningDice1: NonNullable<updown_games["winning_dice1"]>;
  winningDice2: NonNullable<updown_games["winning_dice2"]>;
};

export const handleWinAndLose = async ({
  id,
  winningDice1,
  winningDice2,
}: HandleWinAndLose) => {
  const dt = Now();

  await prisma.updown_games.update({
    data: {
      winning_dice1: winningDice1,
      winning_dice2: winningDice2,
    },
    where: {
      id,
    },
  });

  const { platformCharge } = await getFundSettings(prisma, {
    platformCharge: true,
  });

  const bets = await prisma.updown_bets.findMany({
    where: {
      game_id: id,
    },
  });

  const totalDice = winningDice1 + winningDice2;
  const winResult = totalDice === 7 ? "E7" : totalDice < 7 ? "L7" : "G7";

  return Promise.all(
    bets.map((bet) => {
      const { bet_on, bet_amount, id: betId, user_id } = bet;

      const winAmount = calculateWinAmount({
        winResult,
        betOn: bet_on,
        betAmount: bet_amount,
      });

      if (winAmount.greaterThan(0)) {
        const charge = winAmount.mul(platformCharge).div(100);
        const netWinningAmount = winAmount.minus(charge);

        return Promise.all([
          prisma.updown_bets.update({
            data: {
              win_amount: winAmount,
              charge,
              net_win_amount: netWinningAmount,
              status: "WIN",
              result_date_time: dt.toISOString(),
            },
            where: {
              id: betId,
            },
          }),
          walletService.entry2({
            user_id,
            txn_id: betId,
            amount: netWinningAmount,
            note: "WIN (7 UP-DOWN)",
            type: "CREDIT",
            dt,
            wallet_type: "WALLET",
          }),
        ]);
      }
      return prisma.updown_bets.update({
        data: {
          win_amount: 0,
          charge: 0,
          net_win_amount: 0,
          status: "LOSE",
          result_date_time: dt.toISOString(),
        },
        where: {
          id: betId,
        },
      });
    })
  );
};

type CalculateWinAmountParams = {
  winResult: updown_bets_bet_on;
  betOn: updown_bets["bet_on"];
  betAmount: updown_bets["bet_amount"];
};

export function calculateWinAmount({
  winResult,
  betOn,
  betAmount,
}: CalculateWinAmountParams) {
  let winAmount = new Prisma.Decimal(0);
  const multipliers = getMultipliers(betOn);

  if (winResult === betOn) {
    const amount = betAmount.mul(multipliers);
    winAmount = winAmount.plus(amount);
  }

  return winAmount;
}
