import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getSupportSubjects = createFastifyHandler({
  method: "GET",
  path: "/admin/subjects",
  options: { auth: "admin" },

  async handler({ reply, ctx }) {
    const subjects = await ctx.db.meddolic_config_support_subject.findMany({
      where: { subjectStatus: 1 },
      select: { subjectId: true, subjectName: true },
    });

    return AppResponse.success(reply, { data: subjects });
  },
});
