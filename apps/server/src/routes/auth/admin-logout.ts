import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const adminLogout = createFastifyHandler({
  method: "POST",
  path: "/admin/logout",
  options: { auth: "admin" },

  handler({ reply }) {
    reply.clearCookie("admin_token", { path: "/" });

    return AppResponse.success(reply, {
      message: "Logout successful",
    });
  },
});
