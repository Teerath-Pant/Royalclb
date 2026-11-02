import type { FastifyInstance } from "fastify";

import { admin_approve } from "./admin_approve";
import { admin_list } from "./admin_list";
import { admin_reject } from "./admin_reject";
import { create } from "./create";
import { list } from "./list";
import { getWithdrawalNeedToTrade } from "./need-to-trade";
import { sendWithdrawalOtp } from "./send-otp";
import { getWithdrawalSettings } from "./settings";

export function withdrawalRouter(app: FastifyInstance) {
  getWithdrawalSettings(app);
  getWithdrawalNeedToTrade(app);
  sendWithdrawalOtp(app);
  create(app);
  list(app);
  admin_list(app);
  admin_approve(app);
  admin_reject(app);
}
