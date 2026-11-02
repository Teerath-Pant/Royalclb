import type dayjs from "dayjs";

import type { PrismaClient, meddolic_game_k3_bets } from "@/lib/prisma";

import { placeBetEntry, isInteger, isBigSmall, isOddEven } from "./bet-utils";

export async function handleType1(
  db: PrismaClient,
  listJoin: string,
  sessionId: meddolic_game_k3_bets["session_id"],
  memberId: meddolic_game_k3_bets["member_id"],
  betAmount: meddolic_game_k3_bets["bet_amount"],
  dateTime: dayjs.Dayjs
) {
  const betsOn = listJoin.split(",");
  await Promise.all(
    betsOn.map((betOn) => {
      if (isInteger(betOn)) {
        return placeBetEntry(db, {
          gameId: sessionId,
          userId: memberId,
          betAmount,
          column: "number",
          dateTime,
          value: betOn,
        });
      } else if (isBigSmall(betOn)) {
        return placeBetEntry(db, {
          gameId: sessionId,
          userId: memberId,
          betAmount,
          column: "big_small",
          dateTime,
          value: betOn === "b" ? 1 : 2,
        });
      } else if (isOddEven(betOn)) {
        return placeBetEntry(db, {
          gameId: sessionId,
          userId: memberId,
          betAmount,
          column: "odd_even",
          dateTime,
          value: betOn === "o" ? 1 : 2,
        });
      }
      throw new Error(`Invalid betOn value: ${betOn}`);
    })
  );
}

export async function handleType2(
  db: PrismaClient,
  listJoin: string,
  sessionId: meddolic_game_k3_bets["session_id"],
  memberId: meddolic_game_k3_bets["member_id"],
  betAmount: meddolic_game_k3_bets["bet_amount"],
  dateTime: dayjs.Dayjs
) {
  const [partOne] = listJoin.split("@");

  if (partOne) {
    const betsOn = partOne.split(",");
    await Promise.all(
      betsOn.map((betOn) =>
        placeBetEntry(db, {
          gameId: sessionId,
          userId: memberId,
          betAmount,
          column: "identical_2",
          dateTime,
          value: betOn,
        })
      )
    );
  }
}

export async function handleType3(
  db: PrismaClient,
  listJoin: string,
  sessionId: meddolic_game_k3_bets["session_id"],
  memberId: meddolic_game_k3_bets["member_id"],
  betAmount: meddolic_game_k3_bets["bet_amount"],
  dateTime: dayjs.Dayjs
) {
  const [partOne, partTwo] = listJoin.split("@");
  if (partOne) {
    const betsOn = partOne.split(",");
    await Promise.all(
      betsOn.map((betOn) =>
        placeBetEntry(db, {
          gameId: sessionId,
          userId: memberId,
          betAmount,
          column: "identical_3",
          dateTime,
          value: betOn,
        })
      )
    );
  }
  if (partTwo && partTwo === "3") {
    await placeBetEntry(db, {
      gameId: sessionId,
      userId: memberId,
      betAmount,
      column: "any_identical_3",
      dateTime,
      value: 1,
    });
  }
}

export async function handleType4(
  db: PrismaClient,
  listJoin: string,
  sessionId: meddolic_game_k3_bets["session_id"],
  memberId: meddolic_game_k3_bets["member_id"],
  betAmount: meddolic_game_k3_bets["bet_amount"],
  dateTime: dayjs.Dayjs
) {
  const [partOne, partTwo, partThree] = listJoin.split("@");

  if (partOne) {
    // Different 3 numbers bet
    await placeBetEntry(db, {
      gameId: sessionId,
      userId: memberId,
      betAmount,
      column: "different_3",
      dateTime,
      value: partOne,
    });
  }

  if (partTwo && partTwo === "u") {
    // Any consecutive 3 numbers bet
    await placeBetEntry(db, {
      gameId: sessionId,
      userId: memberId,
      betAmount,
      column: "any_consecutive_3",
      dateTime,
      value: 1,
    });
  }

  if (partThree) {
    // Different 2 numbers bet
    await placeBetEntry(db, {
      gameId: sessionId,
      userId: memberId,
      betAmount,
      column: "different_2",
      dateTime,
      value: partThree,
    });
  }
}
