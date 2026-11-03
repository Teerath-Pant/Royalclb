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
import { adminDashboard } from "./get-dashboard-admin";
import { getMembers } from "./get-members-admin";
import { setMemberStatus } from "./set-member-status-admin";
import { getMemberDetails } from "./get-member-details-admin";
import { updateMemberDetails } from "./update-member-details-admin";
import { searchMembers } from "./search-members-admin";
import { getSponserName } from "./get-sponser-name-admin";
import { getActiveMembers } from "./get-active-members-admin";
import { getInActiveMembers } from "./get-inactive-members-admin";
import { getMembersByJoinDate } from "./get-members-by-join-date-admin";
import { getWalletOutstanding } from "./get-wallet-outstanding-admin";
import { getWalletStatements } from "./get-wallet-statements-admin";

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

  adminDashboard(app);
  getMembers(app);
  setMemberStatus(app);
  getMemberDetails(app);
  updateMemberDetails(app);
  searchMembers(app);
  getSponserName(app);
  getActiveMembers(app);
  getInActiveMembers(app);
  getMembersByJoinDate(app);
  getWalletOutstanding(app);
  getWalletStatements(app);
}
