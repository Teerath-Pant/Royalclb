import type { Prisma } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";

export const settingsService = {
  get: async <T extends Prisma.meddolic_config_misc_settingSelect>(
    select: T,
    db: Prisma.TransactionClient = prisma
  ): Promise<Prisma.meddolic_config_misc_settingGetPayload<{ select: T }>> => {
    const settings = await db.meddolic_config_misc_setting.findUnique({
      select,
      where: {
        id: 1,
      },
    });

    if (!settings) {
      throw new Error("No settings found");
    }

    return settings;
  },
  set: async (data: Prisma.meddolic_config_misc_settingUpdateInput) => {
    await prisma.meddolic_config_misc_setting.update({
      data,
      where: {
        id: 1,
      },
      select: {
        id: true,
      },
    });
  },
};
