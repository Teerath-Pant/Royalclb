import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

export const updateSupportTicket = createFastifyHandler({
  method: "POST",
  path: "/admin/tickets/:id",
  options: { auth: "admin" },
  params: v.object({ id: v.pipe(v.unknown(), v.toNumber(), v.integer()) }),
  body: v.object({
    subjectId: v.pipe(v.number(), v.integer()),
    ticketStatus: v.pipe(v.number(), v.integer()),
  }),

  async handler({ reply, params, body, ctx }) {
    requireUser(ctx);

    await ctx.db.meddolic_user_support_ticket.updateMany({
      where: { ticketId: params.id },
      data: {
        subjectId: body.subjectId,
        actionDate: Now().toDate(),
        adminMessage: "",
        ticketStatus: body.ticketStatus,
        actionBy: ctx.user.member_id,
      },
    });

    return AppResponse.success(reply, { message: "Action Taken Successfully!!!" });
  },
});
