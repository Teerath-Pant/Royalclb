import type { Prisma } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";

export const gameSettingsService = {
  get: async <T extends Prisma.gameSettingsSelect>(
    select: T,
    where: Prisma.gameSettingsWhereUniqueInput
  ): Promise<Prisma.gameSettingsGetPayload<{ select: T }>> => {
    const settings = await prisma.gameSettings.findUnique({
      select,
      where,
    });

    if (!settings) {
      throw new Error("No settings found");
    }

    return settings;
  },
  set: async (
    data: Prisma.gameSettingsUpdateInput,
    where: Prisma.gameSettingsWhereUniqueInput
  ) =>
    await prisma.gameSettings.update({
      data,
      where,
    }),
};
