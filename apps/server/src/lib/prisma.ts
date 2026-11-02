// oxlint-disable oxc/no-barrel-file
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "../../generated/prisma/client";
import { env } from "../env";

const adapter = new PrismaMariaDb({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  port: env.DB_PORT,
  connectionLimit: 10,
});
const prisma = new PrismaClient({ adapter });

export { prisma };
export * from "../../generated/prisma/client";
