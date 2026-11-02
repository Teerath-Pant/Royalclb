import crypto from "node:crypto";

import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { requireUser } from "@/utils/require-user";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export const revealSeed = createFastifyHandler({
  method: "GET",
  path: "/:betId/reveal-seed",
  options: { auth: "user" },
  params: v.object({
    betId: v.pipe(v.unknown(), v.toNumber()),
  }),

  async handler({ params, reply, ctx }) {
    requireUser(ctx);
    const bet = await ctx.db.chickenRoadBet.findUnique({
      where: { id: params.betId, userId: ctx.user.member_id },
      select: {
        id: true,
        status: true,
        serverSeed: true,
        serverSeedHash: true,
        clientSeed: true,
        nonce: true,
        stepsReached: true,
      },
    });

    if (!bet) {
      throw AppError.notFound({ message: "Bet not found" });
    }
    if (bet.status === "PENDING") {
      throw AppError.badRequest({ message: "Game not finished yet" });
    }

    const valid = sha256(bet.serverSeed) === bet.serverSeedHash;

    return AppResponse.success(reply, {
      message: "Provably fair data",
      data: {
        serverSeed: bet.serverSeed,
        serverSeedHash: bet.serverSeedHash,
        clientSeed: bet.clientSeed,
        nonce: bet.nonce,
        steps: bet.stepsReached,
        verified: valid,
      },
    });
  },
});
