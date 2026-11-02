import type { FastifyReply, FastifyRequest } from "fastify";

import { prisma } from "@/lib/prisma";
import { AppError } from "@/utils/app-error";
import { verifyToken } from "@/utils/jwt";

export async function authenticate(
  req: FastifyRequest,
  _reply: FastifyReply,
  type: "user" | "admin"
) {
  const token: string | undefined = req.cookies?.[`${type}_token`];

  if (!token) {
    throw new AppError("UNAUTHORIZED");
  }

  try {
    const payload = verifyToken(token);

    const user = await prisma.meddolic_user_details.findUnique({
      where: {
        member_id: payload.memberId,
        user_type: type === "admin" ? 1 : 2,
      },
    });

    if (!user || user.account_status === 0) {
      throw new AppError("UNAUTHORIZED");
    }

    req.user = user;
  } catch {
    throw new AppError("UNAUTHORIZED");
  }
}
