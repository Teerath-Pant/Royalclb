import jwt from "jsonwebtoken";

import { env } from "@/env";

export interface JwtPayload {
  memberId: number;
  userType: number;
}

const JWT_EXPIRES_IN = "30d";

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}
