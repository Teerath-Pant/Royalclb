import * as v from "valibot";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const updateMemberDetails = createFastifyHandler({
  method: "POST",
  path: "/admin/members/details",
  options: { auth: "admin" },
  body: v.object({
    memberId: v.number(),
    name: v.string(),
    phone: v.string(),
    emailId: v.string(),
    password: v.string(),
  }),

  async handler({ reply, body, ctx }) {
    const db = ctx.db.meddolic_user_details;

    const exists = await db.findFirst({
      where: {
        OR: [{ email_id: body.emailId }, { phone: body.phone }],
        member_id: { not: body.memberId },
      },
      select: { member_id: true },
    });

    if (exists) {
      throw new AppError("BAD_REQUEST", {
        message: "Mobile No. or Email already exists for another user",
      });
    }

    await db.updateMany({
      where: { member_id: body.memberId },
      data: {
        name: body.name,
        email_id: body.emailId,
        password: body.password,
        phone: body.phone,
      },
    });

    return AppResponse.success(reply, { message: "Profile Updated Successfully" });
  },
});
