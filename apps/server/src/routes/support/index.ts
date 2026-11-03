import { randomInt, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FastifyInstance } from "fastify";
import * as v from "valibot";

import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { requireUser } from "@/utils/require-user";

import { UPLOAD_DIR, detectFileType } from "./files";
import { getSupportSubjects } from "./get-subjects-admin";
import { getSupportTickets } from "./get-tickets-admin";
import { updateSupportTicket } from "./update-ticket-admin";
import { getSupportAttachment } from "./get-attachment-admin";

const MAX_FILE_BYTES = 5_000_000;

async function saveAttachment(base64: string) {
  const bytes = Buffer.from(base64, "base64");
  if (bytes.length > MAX_FILE_BYTES) {
    throw new AppError("BAD_REQUEST", { message: "File must be under 5 MB" });
  }
  const type = detectFileType(bytes);
  if (!type) {
    throw new AppError("BAD_REQUEST", {
      message: "Only PNG, JPG, GIF or PDF files are allowed",
    });
  }
  const fileName = `${randomUUID()}.${type.ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, fileName), bytes);
  return fileName;
}

const getSubjects = createFastifyHandler({
  method: "GET",
  path: "/subjects",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    const subjects = await ctx.db.meddolic_config_support_subject.findMany({
      where: { subjectStatus: 1 },
      select: { subjectId: true, subjectName: true },
    });

    return AppResponse.success(reply, {
      message: "Subjects fetched successfully",
      data: subjects,
    });
  },
});

const getTickets = createFastifyHandler({
  method: "GET",
  path: "/tickets",
  options: { auth: "user" },

  async handler({ reply, ctx }) {
    requireUser(ctx);
    const memberId = ctx.user.member_id;

    const [tickets, subjects] = await Promise.all([
      ctx.db.meddolic_user_support_ticket.findMany({
        where: { memberId },
        orderBy: { raiseDate: "desc" },
        select: {
          ticketId: true,
          ticketCode: true,
          subjectId: true,
          ticketMessage: true,
          adminMessage: true,
          transactionImage: true,
          raiseDate: true,
          actionDate: true,
          ticketStatus: true,
        },
      }),
      ctx.db.meddolic_config_support_subject.findMany({
        select: { subjectId: true, subjectName: true },
      }),
    ]);
    const subjectName = new Map(subjects.map((s) => [s.subjectId, s.subjectName]));

    return AppResponse.success(reply, {
      message: "Tickets fetched successfully",
      data: tickets.map(({ transactionImage, subjectId, ...ticket }) => ({
        ...ticket,
        subject: subjectName.get(subjectId) ?? null,
        hasAttachment: Boolean(transactionImage),
      })),
    });
  },
});

const createTicket = createFastifyHandler({
  method: "POST",
  path: "/tickets",
  options: { auth: "user" },
  body: v.object({
    subjectId: v.pipe(v.number(), v.integer()),
    message: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, "Message is required"),
      v.maxLength(5000, "Message is too long")
    ),
    fileBase64: v.optional(v.string()),
  }),

  async handler({ reply, body, ctx }) {
    requireUser(ctx);
    const memberId = ctx.user.member_id;
    const dt = Now();

    const openTickets = await ctx.db.meddolic_user_support_ticket.count({
      where: { memberId, ticketStatus: { in: [1, 2] } },
    });
    if (openTickets > 0) {
      throw new AppError("BAD_REQUEST", {
        message: "You already have an open ticket",
      });
    }

    const subject = await ctx.db.meddolic_config_support_subject.findFirst({
      where: { subjectId: body.subjectId, subjectStatus: 1 },
      select: { subjectId: true },
    });
    if (!subject) {
      throw new AppError("BAD_REQUEST", { message: "Invalid subject" });
    }

    const fileName = body.fileBase64 ? await saveAttachment(body.fileBase64) : "";

    await ctx.db.meddolic_user_support_ticket.create({
      data: {
        memberId,
        ticketCode: `QC${randomInt(11_101, 100_000)}${memberId}${dt.format("ssHH")}`,
        subjectId: body.subjectId,
        priorityId: 1,
        ticketMessage: body.message,
        transactionImage: fileName,
        raiseDate: dt.toISOString(),
      },
      select: { ticketId: true },
    });

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "Ticket submitted successfully",
    });
  },
});

const getAttachment = createFastifyHandler({
  method: "GET",
  path: "/tickets/:id/attachment",
  options: { auth: "user" },
  params: v.object({
    id: v.pipe(v.unknown(), v.toNumber(), v.integer()),
  }),

  async handler({ reply, params, ctx }) {
    requireUser(ctx);
    const ticket = await ctx.db.meddolic_user_support_ticket.findFirst({
      where: { ticketId: params.id, memberId: ctx.user.member_id },
      select: { transactionImage: true },
    });
    if (!ticket?.transactionImage) {
      throw new AppError("NOT_FOUND", { message: "Attachment not found" });
    }

    // basename: older rows hold a legacy relative path, which must not escape UPLOAD_DIR.
    const fileName = path.basename(ticket.transactionImage);
    const bytes = await readFile(path.join(UPLOAD_DIR, fileName)).catch(() => null);
    if (!bytes) {
      throw new AppError("NOT_FOUND", { message: "Attachment not found" });
    }

    return reply
      .type(detectFileType(bytes)?.mime ?? "application/octet-stream")
      .header("Content-Disposition", "inline")
      .send(bytes);
  },
});

export function supportRouter(app: FastifyInstance) {
  getSubjects(app);
  getTickets(app);
  createTicket(app);
  getAttachment(app);

  getSupportSubjects(app);
  getSupportTickets(app);
  updateSupportTicket(app);
  getSupportAttachment(app);
}
