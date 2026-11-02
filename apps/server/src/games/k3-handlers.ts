import { Prisma } from "@/lib/prisma";
import type { meddolic_game_k3_bets } from "@/lib/prisma";

import type { NumberBet, Odds } from "./k3";

type HandleNumber = {
  number: number;
  totalDice: number;
  betAmount: Prisma.Decimal;
  ODDS: Odds;
};
const handleNumber = ({ number, totalDice, betAmount, ODDS }: HandleNumber) => {
  if (number === totalDice) {
    return betAmount.times(ODDS.NUMBER[number as NumberBet]);
  }

  return new Prisma.Decimal(0);
};

type HandleBigSmall = {
  bigSmall: number;
  totalDice: number;
  betAmount: Prisma.Decimal;
  ODDS: Odds;
};
const handleBigSmall = ({
  bigSmall,
  totalDice,
  betAmount,
  ODDS,
}: HandleBigSmall) => {
  if (bigSmall === 1 && totalDice >= 11) {
    return betAmount.times(ODDS.BIG_SMALL[1]);
  }

  if (bigSmall === 2 && totalDice <= 10) {
    return betAmount.times(ODDS.BIG_SMALL[2]);
  }

  return new Prisma.Decimal(0);
};

type HandleOddEven = {
  oddEven: number;
  totalDice: number;
  betAmount: Prisma.Decimal;
  ODDS: Odds;
};
const handleOddEven = ({
  oddEven,
  totalDice,
  betAmount,
  ODDS,
}: HandleOddEven) => {
  if (oddEven === 1 && totalDice % 2 === 1) {
    return betAmount.times(ODDS.ODD_EVEN[1]);
  }

  if (oddEven === 2 && totalDice % 2 === 0) {
    return betAmount.times(ODDS.ODD_EVEN[2]);
  }

  return new Prisma.Decimal(0);
};

type HandleIdentical2 = {
  identical2: string;
  winningDice1: number;
  winningDice2: number;
  winningDice3: number;
  betAmount: Prisma.Decimal;
  ODDS: Odds;
};
const handleIdentical2 = ({
  identical2,
  winningDice1,
  winningDice2,
  betAmount,
  ODDS,
}: HandleIdentical2) => {
  if (identical2 === `${winningDice1}${winningDice2}`) {
    return betAmount.times(ODDS.IDENTICAL_2);
  }

  return new Prisma.Decimal(0);
};

type HandleDifferent2 = {
  different2: string;
  winningDice1: number;
  winningDice2: number;
  winningDice3: number;
  betAmount: Prisma.Decimal;
  ODDS: Odds;
};
const handleDifferent2 = ({
  different2,
  betAmount,
  winningDice1,
  winningDice2,
  winningDice3,
  ODDS,
}: HandleDifferent2) => {
  const different2New = different2.split(",");

  if (
    (different2New.includes(winningDice1.toString()) &&
      different2New.includes(winningDice2.toString()) &&
      winningDice1 !== winningDice2) ||
    (different2New.includes(winningDice1.toString()) &&
      different2New.includes(winningDice3.toString()) &&
      winningDice1 !== winningDice3) ||
    (different2New.includes(winningDice2.toString()) &&
      different2New.includes(winningDice3.toString()) &&
      winningDice2 !== winningDice3)
  ) {
    return betAmount.times(ODDS.DIFFERENT_2);
  }

  return new Prisma.Decimal(0);
};

type HandleIdentical3 = {
  identical3: string;
  winningDice1: number;
  winningDice2: number;
  winningDice3: number;
  betAmount: Prisma.Decimal;
  ODDS: Odds;
};
const handleIdentical3 = ({
  identical3,
  betAmount,
  winningDice1,
  winningDice2,
  winningDice3,
  ODDS,
}: HandleIdentical3) => {
  if (identical3 === `${winningDice1}${winningDice2}${winningDice3}`) {
    return betAmount.times(ODDS.IDENTICAL_3);
  }

  return new Prisma.Decimal(0);
};

type HandleAnyIdentical3 = {
  winningDice1: number;
  winningDice2: number;
  winningDice3: number;
  betAmount: Prisma.Decimal;
  ODDS: Odds;
};
const handleAnyIdentical3 = ({
  betAmount,
  winningDice1,
  winningDice2,
  winningDice3,
  ODDS,
}: HandleAnyIdentical3) => {
  if (
    winningDice1 === winningDice2 &&
    winningDice1 === winningDice3 &&
    winningDice2 === winningDice3
  ) {
    return betAmount.times(ODDS.ANY_IDENTICAL_3);
  }

  return new Prisma.Decimal(0);
};

type HandleDifferent3 = {
  different3: string;
  winningDice1: number;
  winningDice2: number;
  winningDice3: number;
  betAmount: Prisma.Decimal;
  ODDS: Odds;
};
const handleDifferent3 = ({
  different3,
  betAmount,
  winningDice1,
  winningDice2,
  winningDice3,
  ODDS,
}: HandleDifferent3) => {
  const different3New = different3.split(",");

  if (
    different3New.includes(winningDice1.toString()) &&
    different3New.includes(winningDice2.toString()) &&
    different3New.includes(winningDice3.toString()) &&
    winningDice1 !== winningDice2 &&
    winningDice1 !== winningDice3 &&
    winningDice2 !== winningDice3
  ) {
    return betAmount.times(ODDS.DIFFERENT_3);
  }

  return new Prisma.Decimal(0);
};

type HandleAnyConsecutive3 = {
  winningDice1: number;
  winningDice2: number;
  winningDice3: number;
  betAmount: Prisma.Decimal;
  ODDS: Odds;
};
const handleAnyConsecutive3 = ({
  betAmount,
  winningDice1,
  winningDice2,
  winningDice3,
  ODDS,
}: HandleAnyConsecutive3) => {
  if (
    (winningDice1 + 1 === winningDice2 && winningDice2 + 1 === winningDice3) ||
    (winningDice1 - 1 === winningDice2 && winningDice2 - 1 === winningDice3)
  ) {
    return betAmount.times(ODDS.ANY_CONSECUTIVE_3);
  }

  return new Prisma.Decimal(0);
};

type CalculateWinAmount = {
  bet: meddolic_game_k3_bets;
  ODDS: Odds;
  winningDice1: number;
  winningDice2: number;
  winningDice3: number;
  totalDice: number;
};
export const calculateWinAmount = ({
  bet,
  ODDS,
  winningDice1,
  winningDice2,
  winningDice3,
  totalDice,
}: CalculateWinAmount) => {
  const {
    bet_amount: betAmount,
    number,
    big_small: bigSmall,
    odd_even: oddEven,
    identical_2: identical2,
    different_2: different2,
    identical_3: identical3,
    any_identical_3: anyIdentical3,
    different_3: different3,
    any_consecutive_3: anyConsecutive3,
  } = bet;

  let winAmount = new Prisma.Decimal(0);

  if (number) {
    const amount = handleNumber({ number, totalDice, betAmount, ODDS });
    winAmount = winAmount.plus(amount);
  }

  if (bigSmall) {
    const amount = handleBigSmall({ bigSmall, totalDice, betAmount, ODDS });
    winAmount = winAmount.plus(amount);
  }

  if (oddEven) {
    const amount = handleOddEven({ oddEven, totalDice, betAmount, ODDS });
    winAmount = winAmount.plus(amount);
  }

  if (identical2) {
    const amount = handleIdentical2({
      identical2,
      winningDice1,
      winningDice2,
      winningDice3,
      betAmount,
      ODDS,
    });
    winAmount = winAmount.plus(amount);
  }

  if (different2) {
    const amount = handleDifferent2({
      different2,
      winningDice1,
      winningDice2,
      winningDice3,
      betAmount,
      ODDS,
    });
    winAmount = winAmount.plus(amount);
  }

  if (identical3) {
    const amount = handleIdentical3({
      identical3,
      winningDice1,
      winningDice2,
      winningDice3,
      betAmount,
      ODDS,
    });
    winAmount = winAmount.plus(amount);
  }

  if (anyIdentical3) {
    const amount = handleAnyIdentical3({
      winningDice1,
      winningDice2,
      winningDice3,
      betAmount,
      ODDS,
    });
    winAmount = winAmount.plus(amount);
  }

  if (different3) {
    const amount = handleDifferent3({
      different3,
      winningDice1,
      winningDice2,
      winningDice3,
      betAmount,
      ODDS,
    });
    winAmount = winAmount.plus(amount);
  }

  if (anyConsecutive3) {
    const amount = handleAnyConsecutive3({
      winningDice1,
      winningDice2,
      winningDice3,
      betAmount,
      ODDS,
    });
    winAmount = winAmount.plus(amount);
  }

  return winAmount;
};
