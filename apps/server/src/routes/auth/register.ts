import * as v from "valibot";

import { config } from "@/config";
import { RegistrationBonus } from "@/incomes/registration-bonus";
import { OtpService } from "@/services/otp.service";
import { AppError } from "@/utils/app-error";
import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";
import { Now } from "@/utils/date";
import { generateCode } from "@/utils/gen-token";

export const register = createFastifyHandler({
  method: "POST",
  path: "/register",
  body: v.object({
    referralCode: v.optional(v.string("Referral code must be a string"), ""),
    name: v.pipe(
      v.string("Name must be a string"),
      v.maxLength(255, "Name must be less than 255 characters")
    ),
    phone: v.pipe(
      v.string("Phone number must be a string"),
      v.length(10, "Phone number must be exactly 10 digits")
    ),
    email: v.pipe(v.string(), v.email("Invalid email address")),
    otp: v.pipe(
      v.string("OTP code is required"),
      v.length(6, "OTP code must be 6 digits")
    ),
    password: v.pipe(
      v.string("Password must be a string"),
      v.minLength(4, "Password must be at least 4 characters")
    ),
    countryId: v.number("Country ID must be a number"),
  }),

  async handler({ reply, body, ctx }) {
    const dt = Now();

    const referralCode =
      body.referralCode.trim() === "" ? "RC10008" : body.referralCode;

    const referrer = await ctx.db.meddolic_user_details.findFirst({
      where: { user_id: referralCode },
      select: {
        member_id: true,
        account_status: true,
      },
    });

    if (!referrer) {
      throw new AppError("BAD_REQUEST", { message: "Invalid referral code" });
    }

    if (referrer.account_status === 0) {
      throw new AppError("BAD_REQUEST", {
        message: "Referrer account is blocked",
      });
    }

    const existing = await ctx.db.meddolic_user_details.findFirst({
      where: {
        OR: [{ phone: body.phone }, { email_id: body.email }],
      },
      select: { phone: true, email_id: true },
    });

    if (existing) {
      throw new AppError("BAD_REQUEST", {
        message: `${existing.phone === body.phone ? "Phone" : "Email"} already exists`,
      });
    }

    await OtpService.verifyOtp("register", body.email, body.otp);

    const createdUser = await ctx.db.$transaction(async (tx) => {
      const user = await tx.meddolic_user_details.create({
        data: {
          name: body.name,
          phone: body.phone,
          email_id: body.email,
          password: body.password,
          sponser_id: referrer.member_id,
          countryId: body.countryId,
          date_time: dt.toISOString(),
        },
        omit: {
          password: true,
        },
      });

      const uid = config("uidStart") + user.member_id;
      const code = generateCode(uid);

      await tx.meddolic_user_details.update({
        where: {
          member_id: user.member_id,
        },
        data: {
          user_id: code,
          uid,
        },
      });

      let level = 1;
      let currentReferrerId: number | null = referrer.member_id;

      while (currentReferrerId) {
        await tx.meddolic_user_child_ids.create({
          data: {
            member_id: currentReferrerId,
            child_id: user.member_id,
            level,
          },
        });

        const nextReferrer: { sponser_id: number | null } | null =
          await tx.meddolic_user_details.findUnique({
            where: {
              member_id: currentReferrerId,
            },
            select: {
              sponser_id: true,
            },
          });

        currentReferrerId = nextReferrer?.sponser_id || null;
        level += 1;
      }

      await RegistrationBonus.release(tx, { userId: user.member_id, dt });

      return { ...user, referralCode: code, uid };
    });

    return AppResponse.success(reply, {
      code: "CREATED",
      message: "User registered successfully",
      data: createdUser,
    });
  },
});
