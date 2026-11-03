import { readFile } from "node:fs/promises";
import path from "node:path";
import * as v from "valibot";
import { AppError } from "@/utils/app-error";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { UPLOAD_DIR, detectFileType } from "./files";

export const getSupportAttachment = createFastifyHandler({
  method: "GET",
  path: "/admin/tickets/:id/attachment",
  options: { auth: "admin" },
  params: v.object({ id: v.pipe(v.unknown(), v.toNumber(), v.integer()) }),

  async handler({ reply, params, ctx }) {
    const ticket = await ctx.db.meddolic_user_support_ticket.findUnique({
      where: { ticketId: params.id },
      select: { transactionImage: true },
    });

    if (!ticket?.transactionImage) {
      throw new AppError("NOT_FOUND", { message: "Attachment not found" });
    }

    const bytes = await readFile(path.join(UPLOAD_DIR, path.basename(ticket.transactionImage))).catch(() => null);

    if (!bytes) {
      throw new AppError("NOT_FOUND", { message: "Attachment not found" });
    }

    return reply
      .type(detectFileType(bytes)?.mime ?? "application/octet-stream")
      .header("Content-Disposition", "inline")
      .send(bytes);
  },
});
