/** Login and forgot-password: the PHP markup with the original scripts' behaviour on the new API. */
import { useEffect, useRef } from "react";

import { apiPost } from "@/lib/api";
import { notyf } from "@/lib/notyf";
import { navigate } from "@/utils/navigation";

import { screen } from "./screen";
import type { Handlers } from "./use-legacy";

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;

function setClass(id: string, className: string) {
  const el = byId(id);
  if (el) {
    el.className = className;
  }
}

const dialog = (id: string, state: "active" | "inactive") => setClass(id, `dialog ${state}`);

/** The phone/email tabs of the login and forgot-password pages. */
const tabHandlers: Handlers = {
  phoneactive: () => {
    setClass("phonetabactive", "tab active");
    setClass("phonebgactive", "phonebg phoneactive");
    setClass("phonefontactive", "font30 phonefont30active");
    setClass("MyElementphone", "tab-content activecontent");
    setClass("emailtabactive", "tab");
    setClass("emailbgactive", "emialbg");
    setClass("emailfontactive", "font30");
    setClass("MyElementemail", "tab-content");
  },
  emailactive: () => {
    setClass("emailtabactive", "tab active");
    setClass("emailbgactive", "emialbg emailactive");
    setClass("emailfontactive", "font30 emailfont30active");
    setClass("MyElementemail", "tab-content activecontent");
    setClass("phonetabactive", "tab");
    setClass("phonebgactive", "phonebg");
    setClass("phonefontactive", "font30");
    setClass("MyElementphone", "tab-content");
  },
  closedialog: () => dialog("first-dialog", "inactive"),
  closedialog2: () => dialog("first-dialog2", "inactive"),
  closedialog22: () => dialog("first-dialog2", "active"),
};

const messageOf = (error: unknown, fallback: string) => (error instanceof Error && error.message ? error.message : fallback);

export const Login = screen(() => import("./pages/Login"), "LoginView", "login.php", () => {
  const awaitingOtp = useRef(false);

  // The eye icon toggles the password field, as the inline script did.
  useEffect(() => {
    const eye = byId("togglePassword");
    const input = byId<HTMLInputElement>("inputPassword");
    const toggle = () => input?.setAttribute("type", input.getAttribute("type") === "password" ? "text" : "password");
    eye?.addEventListener("click", toggle);
    return () => eye?.removeEventListener("click", toggle);
  }, []);

  return {
    handlers: tabHandlers,
    onSubmit: async (e) => {
      e.preventDefault();
      const phone = byId<HTMLInputElement>("inputPhone")!;
      const password = byId<HTMLInputElement>("inputPassword")!;
      const otp = byId<HTMLInputElement>("inputOtp")!;
      const button = byId<HTMLButtonElement>("loginBtn")!;
      try {
        if (awaitingOtp.current) {
          const res = await apiPost("/auth/login/verify-otp", { phone: phone.value.trim(), otp: otp.value.trim() });
          notyf.success(res.message);
          navigate("/home", { replace: true });
          return;
        }
        const res = await apiPost("/auth/login", { phone: phone.value.trim(), password: password.value.trim() });
        notyf.success(res.message);
        if ((res.data as { requiresOtp?: boolean } | undefined)?.requiresOtp) {
          awaitingOtp.current = true;
          byId("otpSection")?.classList.remove("hide");
          phone.disabled = true;
          password.disabled = true;
          button.textContent = "Verify OTP";
          otp.focus();
          return;
        }
        navigate("/home", { replace: true });
      } catch (error) {
        notyf.error(messageOf(error, "Login failed"));
      }
    },
  };
});

export const ForgotPassword = screen(() => import("./pages/ForgotPassword"), "ForgotPasswordView", "forgot_password.php", () => {
  const sendOtp = async () => {
    const button = byId<HTMLButtonElement>("otp-btn")!;
    const phone = byId<HTMLInputElement>("inputPhone")!;
    const number = phone.value.trim();
    if (!number) {
      alert("Please enter your phone number!");
      phone.focus();
      return;
    }
    if (!/^\d{10}$/.test(number)) {
      alert("Please enter a valid phone number!");
      phone.focus();
      return;
    }
    button.disabled = true;
    button.innerText = "Sending...";
    try {
      alert((await apiPost("/auth/forgot-password/send-otp", { phone: number })).message);
    } catch (error) {
      alert(messageOf(error, "Something went wrong. Please try again later!"));
    } finally {
      button.disabled = false;
      button.innerText = "Send OTP";
    }
  };

  useEffect(() => {
    const button = byId("otp-btn");
    const run = () => void sendOtp();
    button?.addEventListener("click", run);
    return () => button?.removeEventListener("click", run);
  }, []);

  return {
    handlers: tabHandlers,
    onSubmit: async (e) => {
      e.preventDefault();
      const form = new FormData(e.target as HTMLFormElement);
      try {
        const res = await apiPost("/auth/forgot-password/reset", {
          phone: String(form.get("phone")),
          otp: String(form.get("otp")),
          password: String(form.get("password")),
        });
        const messages = byId("messages");
        if (messages) {
          messages.textContent = res.message;
        }
        dialog("first-dialog", "active");
        navigate("/login", { replace: true });
      } catch (error) {
        const messages = byId("messages");
        if (messages) {
          messages.textContent = messageOf(error, "Something went wrong");
        }
        dialog("first-dialog", "active");
      }
    },
  };
});
