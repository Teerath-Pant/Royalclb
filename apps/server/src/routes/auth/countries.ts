import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const getCountries = createFastifyHandler({
  method: "GET",
  path: "/countries",

  async handler({ reply, ctx }) {
    const countries = await ctx.db.countries.findMany({
      select: { id: true, nicename: true, phonecode: true },
      orderBy: { nicename: "asc" },
    });

    return AppResponse.success(reply, {
      message: "Countries fetched successfully",
      data: countries,
    });
  },
});
