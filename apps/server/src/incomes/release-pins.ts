import type dayjs from "dayjs";

import { prisma } from "@/lib/prisma";
import type { meddolic_user_details } from "@/lib/prisma";

type ReleasePinParams = {
  userId: meddolic_user_details["member_id"];
  dt: dayjs.Dayjs;
  leadershipId: meddolic_user_details["leadershipId"];
};

export const releasePin = async ({
  userId,
  leadershipId,
  dt,
}: ReleasePinParams) => {
  const nextLeadershipId = leadershipId + 1;

  const config = await prisma.leadership_pins.findUnique({
    where: {
      id: nextLeadershipId,
    },
  });

  if (!config) {
    return;
  }

  const totalDirects = await prisma.meddolic_user_details.count({
    where: {
      sponser_id: userId,
      leadershipId,
    },
  });

  if (totalDirects < config.direct_need) {
    return;
  }

  const totalTeam = await prisma.meddolic_user_child_ids.count({
    where: {
      member_id: userId,
      level: {
        lte: 5,
      },
      meddolic_user_details_meddolic_user_child_ids_child_idTomeddolic_user_details:
        {
          leadershipId,
        },
    },
  });

  if (totalTeam < config.team_need) {
    return;
  }

  await Promise.all([
    prisma.reward_summary.create({
      data: {
        user_id: userId,
        direct_team: totalDirects,
        total_team: totalTeam,
        income: config.reward,
        duration: config.duration,
        date_time: dt.toISOString(),
        status: "RUNNING",
      },
    }),
    prisma.meddolic_user_details.update({
      where: {
        member_id: userId,
      },
      data: {
        leadershipId: nextLeadershipId,
      },
    }),
  ]);

  await releasePin({
    userId,
    leadershipId: nextLeadershipId,
    dt,
  });
};
