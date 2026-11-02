import type { FastifyInstance } from "fastify";

import { get2fa } from "./get-2fa";
import { getName } from "./get-name";
import { getSubordinateData } from "./get-subordinate-data";
import { getUsers } from "./get-users";
import { getWalletDetails } from "./get-wallet-details";
import { getWallets } from "./get-wallets";
import {
  getFirstDepositBonus,
  getHome,
  getPromotion,
  getWalletSummary,
} from "./panel-stats";
import { changePassword, getProfile, updateProfile } from "./profile";
import {
  getDirectTeam,
  getNewRegistrations,
  getStatement,
  getTeam,
} from "./team";
import { toggle2fa } from "./toggle-2fa";

export function userRouter(app: FastifyInstance) {
  getName(app);
  getWallets(app);
  getWalletDetails(app);
  getSubordinateData(app);
  getUsers(app);
  get2fa(app);
  toggle2fa(app);
  getProfile(app);
  updateProfile(app);
  changePassword(app);
  getWalletSummary(app);
  getPromotion(app);
  getFirstDepositBonus(app);
  getHome(app);
  getDirectTeam(app);
  getTeam(app);
  getNewRegistrations(app);
  getStatement(app);
}
