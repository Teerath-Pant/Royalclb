import * as v from "valibot";

import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toIstDateTimeString } from "@/utils/date";
import { pageQuery, paged } from "@/utils/page-query";

const filled = (value: unknown) => value !== null && value !== undefined && value !== 0 && value !== "";

type Bet = {
  number: number | null;
  big_small: number | null;
  odd_even: number | null;
  identical_2: string | null;
  different_2: string | null;
  identical_3: string | null;
  any_identical_3: number | null;
  different_3: string | null;
  any_consecutive_3: number | null;
};

function handleBetOn(bet: Bet) {
  if (filled(bet.number)) return bet.number;
  if (filled(bet.big_small)) return bet.big_small === 1 ? "Big" : "Small";
  if (filled(bet.odd_even)) return bet.odd_even === 1 ? "Odd" : "Even";
  if (filled(bet.identical_2)) return bet.identical_2;
  if (filled(bet.different_2)) return `${bet.different_2}(2)`;
  if (filled(bet.identical_3)) return bet.identical_3;
  if (filled(bet.any_identical_3)) return "Identical 3";
  if (filled(bet.different_3)) return `${bet.different_3}(3)`;
  if (filled(bet.any_consecutive_3)) return "Consecutive 3";
  return null;
}

export const betHistoryAdmin = createFastifyHandler({
  method: "GET",
  path: "/bet-history-admin",
  options: { auth: "admin" },
  searchParams: v.object({
    sessionId: v.pipe(v.unknown(), v.toNumber()),
    search: v.optional(v.string()),
    ...pageQuery,
  }),

  async handler({ searchParams, reply, ctx }) {
    const { sessionId, search, page, limit } = searchParams;

    const session = await ctx.db.meddolic_game_k3_summary.findUnique({
      select: { game_id: true, interval_min: true },
      where: { id: sessionId },
    });

    let memberIds: number[] | undefined;
    if (search) {
      const users = await ctx.db.meddolic_user_details.findMany({
        select: { member_id: true },
        where: {
          OR: [
            { name: { contains: search } },
            ...(/^\d+$/.test(search) ? [{ uid: Number(search) }] : []),
          ],
        },
      });
      memberIds = users.map((u) => u.member_id);
    }

    const where = {
      session_id: sessionId,
      ...(memberIds ? { member_id: { in: memberIds } } : {}),
    };

    const [total, bets] = await Promise.all([
      ctx.db.meddolic_game_k3_bets.count({ where }),
      ctx.db.meddolic_game_k3_bets.findMany({
        where,
        orderBy: { id: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    const users = await ctx.db.meddolic_user_details.findMany({
      select: { member_id: true, uid: true, name: true, wallet: true, fundWallet: true, bonusWallet: true },
      where: { member_id: { in: bets.map((b) => b.member_id) } },
    });
    const userById = new Map(users.map((u) => [u.member_id, u]));

    const rows = bets.map((b, i) => {
      const user = userById.get(b.member_id);

      return {
        index: (page - 1) * limit + i + 1,
        id: b.id,
        uid: user?.uid ?? null,
        name: user?.name ?? "",
        totalWallet: user ? user.wallet.plus(user.fundWallet).plus(user.bonusWallet).toFixed(2) : "0.00",
        betOn: handleBetOn(b),
        betAmount: b.bet_amount.toFixed(2),
        winAmount: b.win_amount?.toFixed(2) ?? "",
        charge: b.charge?.toFixed(2) ?? "",
        netWinAmount: b.net_win_amount?.toFixed(2) ?? "",
        status: b.status,
        dateTime: toIstDateTimeString(b.date_time),
      };
    });

    return AppResponse.success(reply, {
      data: {
        gameId: session?.game_id ?? null,
        interval: session ? Number(session.interval_min) : null,
        ...paged(rows, total, page, limit),
      },
    });
  },
});
