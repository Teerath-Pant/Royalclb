import crypto from "node:crypto";

import type { PrismaClient } from "@/lib/prisma";
import { Now } from "@/utils/date";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function rotateSeed(db: PrismaClient) {
  return db.$transaction(async (tx) => {
    const dt = Now();
    const current = await tx.provablyFairSeed.findFirst({
      where: { isActive: true },
    });

    if (current) {
      await tx.provablyFairSeed.update({
        where: { id: current.id },
        data: {
          isActive: false,
          revealedAt: dt.toISOString(),
        },
      });
    }

    const serverSeed = crypto.randomBytes(32).toString("hex");
    const serverSeedHash = sha256(serverSeed);

    await tx.provablyFairSeed.create({
      data: {
        serverSeed,
        serverSeedHash,
        isActive: true,
        createdAt: dt.toISOString(),
      },
    });
  });
}
