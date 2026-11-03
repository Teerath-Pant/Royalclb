import * as v from "valibot";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { toDateTimeString } from "@/utils/date";
import { pageQuery, paged } from "@/utils/page-query";

const toDisplayDate = (date: Date | null) => {
  if (!date) return "";
  const value = toDateTimeString(date);
  return `${value.slice(8, 10)}-${value.slice(5, 7)}-${value.slice(0, 4)} ${value.slice(11)}`;
};

export const getSupportTickets = createFastifyHandler({
  method: "GET",
  path: "/admin/tickets",
  options: { auth: "admin" },
  searchParams: v.object({
    subjectId: v.optional(v.string()),
    ticketStatus: v.optional(v.string()),
    ...pageQuery,
  }),

  async handler({ reply, searchParams, ctx }) {
    const { page, limit } = searchParams;

    const where = {
      ...(searchParams.subjectId ? { subjectId: Number(searchParams.subjectId) } : {}),
      ...(searchParams.ticketStatus ? { ticketStatus: Number(searchParams.ticketStatus) } : {}),
    };

    const [total, tickets] = await Promise.all([
      ctx.db.meddolic_user_support_ticket.count({ where }),
      ctx.db.meddolic_user_support_ticket.findMany({
        where,
        orderBy: { raiseDate: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
    ]);

    const [users, subjects] = await Promise.all([
      ctx.db.meddolic_user_details.findMany({
        select: { member_id: true, user_id: true, name: true },
        where: { member_id: { in: tickets.map((t) => t.memberId) } },
      }),
      ctx.db.meddolic_config_support_subject.findMany({
        select: { subjectId: true, subjectName: true },
      }),
    ]);
    const userById = new Map(users.map((u) => [u.member_id, u]));
    const subjectById = new Map(subjects.map((s) => [s.subjectId, s.subjectName]));

    const rows = tickets.map((t, i) => ({
      index: (page - 1) * limit + i + 1,
      ticketId: t.ticketId,
      userId: userById.get(t.memberId)?.user_id ?? "",
      name: userById.get(t.memberId)?.name ?? "",
      ticketCode: t.ticketCode,
      subjectId: t.subjectId,
      subjectName: subjectById.get(t.subjectId) ?? "",
      ticketMessage: t.ticketMessage,
      hasAttachment: Boolean(t.transactionImage),
      raiseDate: toDisplayDate(t.raiseDate),
      actionDate: t.actionDate ? toDateTimeString(t.actionDate) : "",
      ticketStatus: t.ticketStatus,
    }));

    return AppResponse.success(reply, { data: paged(rows, total, page, limit) });
  },
});
