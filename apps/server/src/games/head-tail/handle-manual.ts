import type { headTail } from "@/lib/prisma";

import { handleWinAndLose } from "./handle-win-lose";

type HandleManual = {
  id: headTail["id"];
  mode: string;
};

export const handleManual = async ({ id, mode }: HandleManual) => {
  const result = mode as NonNullable<headTail["result"]>;

  await handleWinAndLose({
    id,
    result,
  });
};
