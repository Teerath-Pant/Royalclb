import { env } from "@/env";

export const generateCode = (uid: number) => `${env.APP_PREFIX}${uid}`;
