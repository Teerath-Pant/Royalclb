import type { Prisma } from "@/lib/prisma";
import { prisma } from "@/lib/prisma";

export const k3SettingsService = {
  get: async <T extends Prisma.meddolic_config_k3_settingsSelect>(
    select: T,
    interval: number
  ): Promise<Prisma.meddolic_config_k3_settingsGetPayload<{ select: T }>> => {
    const settings = await prisma.meddolic_config_k3_settings.findUnique({
      select,
      where: {
        interval_min: interval,
      },
    });

    if (!settings) {
      throw new Error("No settings found");
    }

    return settings;
  },
  set: async (
    data: Prisma.meddolic_config_k3_settingsUpdateInput,
    interval: number
  ) =>
    await prisma.meddolic_config_k3_settings.update({
      data,
      where: {
        interval_min: interval,
      },
    }),
};
