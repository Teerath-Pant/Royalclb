import type { FastifyInstance } from "fastify";
import * as v from "valibot";

import { createWalletEntry } from "@/ops/wallet";
import { withColumnScale } from "@/utils/decimal-scale";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

const getAttendance = createFastifyHandler({
  method: "GET",
  path: "/",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const { member_id } = ctx.user;

    const [rewards, achieved] = await Promise.all([
      ctx.db.meddolic_config_attendence_bonus.findMany({
        where: { status: 1 },
        select: { day: true, bet_need: true, bonus: true },
        orderBy: { id: "asc" },
      }),
      ctx.db.meddolic_user_attendence_bonus.findMany({
        where: { member_id },
        select: { id: true, day: true, bonus: true, status: true },
        orderBy: { id: "asc" },
      }),
    ]);

    // The PHP page took the first row of a day, so a repeated day keeps its earliest entry.
    const achievedByDay = new Map(achieved.toReversed().map((a) => [a.day, a]));
    const totalClaimed = achieved
      .filter((a) => a.status === 1)
      .reduce((sum, a) => sum + a.bonus.toNumber(), 0);

    return AppResponse.success(reply, {
      message: "Attendance fetched successfully",
      data: {
        totalClaimed: totalClaimed.toFixed(2),
        totalAttended: achieved.length,
        days: rewards.map((reward) => {
          const entry = achievedByDay.get(reward.day);
          return {
            day: reward.day,
            ...(({ bet_need, bonus }) => ({ betNeed: bet_need, bonus }))(
              withColumnScale("meddolic_config_attendence_bonus", reward)
            ),
            id: entry?.id ?? null,
            status: !entry ? "PENDING" : entry.status === 1 ? "CLAIMED" : "CLAIMABLE",
          };
        }),
      },
    });
  },
});

const claimAttendance = createFastifyHandler({
  method: "POST",
  path: "/:id/claim",
  options: { auth: "user" },
  params: v.object({
    id: v.pipe(v.unknown(), v.toNumber(), v.integer()),
  }),

  async handler({ reply, params, ctx }) {
    requireUser(ctx);
    const { member_id } = ctx.user;
    const dt = Now();

    await ctx.db.$transaction(async (tx) => {
      // Flipping status in the WHERE makes a double claim, or claiming someone else's row, a no-op.
      const { count } = await tx.meddolic_user_attendence_bonus.updateMany({
        where: { id: params.id, member_id, status: 0 },
        data: { status: 1 },
      });
      if (count === 0) {
        throw new AppError("BAD_REQUEST", {
          message: "This bonus is not available to claim",
        });
      }

      const { bonus } = await tx.meddolic_user_attendence_bonus.findUniqueOrThrow({
        where: { id: params.id },
        select: { bonus: true },
      });

      await createWalletEntry(tx, {
        userId: member_id,
        refId: params.id,
        amount: bonus,
        note: "Attendance bonus",
        type: "CREDIT",
        wallet: "BONUS_WALLET",
        dt,
      });
    });

    return AppResponse.success(reply, {
      message: "Attendance bonus claimed successfully",
    });
  },
});

export function attendanceRouter(app: FastifyInstance) {
  getAttendance(app);
  claimAttendance(app);
}
