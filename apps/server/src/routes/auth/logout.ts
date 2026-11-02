import { AppResponse } from "@/utils/app-response";
import { createFastifyHandler } from "@/utils/create-fastify-handler";

export const logout = createFastifyHandler({
  method: "POST",
  path: "/logout",
  options: { auth: "user" },

  handler({ reply }) {
    reply.clearCookie("user_token", { path: "/" });

    return AppResponse.success(reply, {
      message: "Logout successful",
    });
  },
});
