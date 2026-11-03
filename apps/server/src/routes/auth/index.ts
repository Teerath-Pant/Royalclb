import type { FastifyInstance } from "fastify";

import { adminLogin } from "./admin-login";
import { adminLogout } from "./admin-logout";
import { adminMe } from "./admin-me";
import { getCountries } from "./countries";
import { forgotPasswordReset, forgotPasswordSendOtp } from "./forgot-password";
import { impersonate } from "./impersonate";
import { login } from "./login";
import { logout } from "./logout";
import { register } from "./register";
import { sendOtp } from "./send-otp";
import { verifyAdminLoginOtp } from "./verify-admin-login-otp";
import { verifyLoginOtp } from "./verify-login-otp";
import { changeAdminPassword } from "./admin-change-password";

export const authRouter = (app: FastifyInstance) => {
  register(app);
  login(app);
  verifyLoginOtp(app);
  adminLogin(app);
  verifyAdminLoginOtp(app);
  logout(app);
  adminLogout(app);
  adminMe(app);
  impersonate(app);
  sendOtp(app);
  getCountries(app);
  forgotPasswordSendOtp(app);
  forgotPasswordReset(app);

  changeAdminPassword(app);
};
