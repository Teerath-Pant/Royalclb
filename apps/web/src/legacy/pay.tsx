/** Deposit payment pages (UPI, USDT, online): the PHP markup with its three scripts folded into one hook. */
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";
import { useEffect } from "react";

import { api, apiPost } from "@/lib/api";
import { notyf } from "@/lib/notyf";
import { getSearchParam, navigate } from "@/utils/navigation";

import { screen } from "./screen";
import type { Loader, Row } from "./screen";

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T | null;

type Kind = "INR" | "USDT" | "ONLINE";

/** Same behaviour as the inline script: copy, cancel, the countdown, the QR code and the submit button. */
function usePayPage(kind: Kind, qrValue: string | undefined, rechargeId?: number, amount?: string) {
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const on = (el: Element | null, event: string, run: () => void) => {
      el?.addEventListener(event, run);
      cleanups.push(() => el?.removeEventListener(event, run));
    };

    // Countdown. The original added 2 to the *string* "300", which made the window 3002 seconds; kept as is.
    const hd = byId<HTMLInputElement>("hdCounterOne");
    const label = byId("base-timer-label");
    if (hd && label) {
      localStorage.removeItem("saved_countdown");
      localStorage.removeItem("isshow");
      const end = Date.now() + Number(`${hd.value}2`) * 1000;
      const timer = setInterval(() => {
        const distance = end - Date.now();
        const minutes = Math.floor((distance % 3_600_000) / 60_000);
        const seconds = Math.floor((distance % 60_000) / 1000);
        label.textContent = `${`0${minutes}`.slice(-2)}:${`0${seconds}`.slice(-2)}`;
        if (seconds <= 0 && minutes <= 0) {
          clearInterval(timer);
          label.textContent = "00:0";
          navigate("/recharge");
        }
      }, 1000);
      cleanups.push(() => clearInterval(timer));
    }

    on(document.querySelector("[data-todo-onclick^='copyToClipboard1']"), "click", () => {
      void navigator.clipboard.writeText(byId("upi")?.textContent ?? byId<HTMLInputElement>("payAddress")?.value ?? "");
      alert("Copy successful");
    });
    on(document.querySelector("[data-todo-onclick^='cancel']"), "click", () => {
      document.querySelectorAll<HTMLElement>(".login-signin").forEach((el) => (el.style.display = "none"));
      const cancelled = byId("dvcancel");
      if (cancelled) {
        cancelled.style.display = "block";
      }
    });

    const canvas = byId<HTMLCanvasElement>("qrcode");
    if (canvas && qrValue) {
      void QRCode.toCanvas(canvas, qrValue);
    }

    if (kind !== "ONLINE") {
      on(byId("btnpay"), "click", async () => {
        const utrNo = byId<HTMLInputElement>("txt_txnId")?.value.trim() ?? "";
        try {
          const res = await apiPost("/fund/recharge", { id: rechargeId, amount: Number(amount), utrNo, type: kind });
          notyf.success(res.message);
          setTimeout(() => navigate("/recharge", { replace: true }), 2000);
        } catch (error) {
          notyf.error(error instanceof Error ? error.message : "Recharge failed");
        }
      });
    }
    return () => cleanups.forEach((run) => run());
  }, [kind, qrValue, rechargeId, amount]);
}

type Target = { id: number; address: string; amount: number };

function manual(load: Loader, viewName: string, kind: "INR" | "USDT", currentPage: string) {
  return screen(load, viewName, currentPage, () => {
    const amount = getSearchParam("amount") ?? "";
    const { data, error } = useQuery({
      queryKey: ["payment-target", kind, amount],
      queryFn: () => api<Target>(`/fund/payment-target?type=${kind}&amount=${encodeURIComponent(amount)}`),
      staleTime: Number.POSITIVE_INFINITY,
      refetchOnWindowFocus: false,
    });
    useEffect(() => {
      if (error) {
        navigate("/recharge", { replace: true });
      }
    }, [error]);
    usePayPage(kind, data && (kind === "INR" ? `upi://pay?pa=${data.address}&am=${amount}&cu=INR` : data.address), data?.id, amount);
    return { ready: Boolean(data), props: data && { amount, id: data.id, upiId: data.address } };
  });
}

export const UpiPay = manual(() => import("./pages/UpiPay"), "UpiPayView", "INR", "UPIPay.php");
export const UsdtPay = manual(() => import("./pages/UsdtPay"), "UsdtPayView", "USDT", "USDTPay.php");

export const PayOnline = screen(() => import("./pages/PayOnline"), "PayOnlineView", "pay-online.php", () => {
  const orderId = getSearchParam("orderId") ?? "";
  const { data, error } = useQuery({
    queryKey: ["online-order", orderId],
    queryFn: () => api<Row>(`/fund/online-order/${encodeURIComponent(orderId)}`),
  });
  useEffect(() => {
    if (error) {
      navigate("/recharge", { replace: true });
    }
  }, [error]);
  usePayPage("ONLINE", data?.payAddress);
  const gateway = new URLSearchParams({ paymentId: data?.paymentId ?? "", redirect_url: `${window.location.origin}/recharge` });
  return {
    ready: Boolean(data),
    props: data && { amount: data.originalAmount, payAddress: data.payAddress, finalUrl: `https://gateway.faradpay.com/payment?${gateway}` },
  };
});
