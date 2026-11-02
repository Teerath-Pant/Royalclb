import type { FastifyInstance } from "fastify";

import { faradpayCallback } from "./faradpay-callback";
import { getUserWalletAdmin } from "./get-user-wallet-admin";
import { onlineOrder, paymentTarget } from "./payment-target";
import { recharge } from "./recharge";
import { rechargeHistory } from "./recharge-history";
import { rechargeHistoryAdmin } from "./recharge-history-admin";
import { rechargeOnline } from "./recharge-online";
import { rechargeResponseAdmin } from "./recharge-response-admin";
import { transfer } from "./transfer";
import { transferAdmin } from "./transfer-admin";
import { transferHistory } from "./transfer-history";
import { walletDeductAdmin } from "./wallet-deduct-admin";

export function fundRouter(app: FastifyInstance) {
  transferHistory(app);
  transfer(app);
  transferAdmin(app);
  getUserWalletAdmin(app);
  walletDeductAdmin(app);

  paymentTarget(app);
  onlineOrder(app);

  rechargeHistory(app);
  recharge(app);

  rechargeOnline(app);
  faradpayCallback(app);

  rechargeHistoryAdmin(app);
  rechargeResponseAdmin(app);
}
