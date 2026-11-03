/** Small ports of the PHP helpers the legacy templates call, so their markup can stay as written. */
import { navigate } from "@/utils/navigation";

export const FAVICON = "/assets/images/favicon.webp";
export const LOGO = "/assets/images/logo.webp";
export const APP_NAME = "Royalclub";
export const API_URL = "/api";
export const DOMAIN = typeof window === "undefined" ? "" : window.location.host;

/** Game pages are not part of this app; they are still served by the PHP site on the same domain. */
const GAME_PAGE = /^(?:\.\.\/|\/)?(WINGO|aviator|k3|anderbahar|carroulette|7updown|HeadTail|LUCKY100|CRYPTO|FOREX|5d|chicken-road)(?:\/|$)/i;

/** Link target from a template: app routes go through the router, everything else is a real navigation. */
export function go(url: string) {
  const game = GAME_PAGE.exec(url);
  if (/^(https?:|mailto:|tel:)/.test(url)) {
    window.location.href = url;
  } else if (game) {
    window.location.href = `/${url.replace(/^(\.\.\/|\/)/, "")}`;
  } else if (url !== "#" && url !== "") {
    navigate(url);
  }
}

export function number_format(value: unknown, decimals = 0, decPoint = ".", thousands = ",") {
  const n = Number(value ?? 0);
  const fixed = Math.abs(n).toFixed(decimals);
  const [int = "0", dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
  const sign = n < 0 && Number(fixed) !== 0 ? "-" : "";
  return sign + grouped + (dec ? decPoint + dec : "");
}

/** Indian digit grouping (lakhs, crores), same as formatAmount() in conection.php. */
export function formatAmount(value: unknown, decimals = 2, style: "indian" | "international" = "indian") {
  const n = Number(value ?? 0);
  const [int = "0", dec] = Math.abs(n).toFixed(decimals).split(".");
  let grouped: string;
  if (style === "international") {
    grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else if (int.length > 3) {
    grouped = `${int.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${int.slice(-3)}`;
  } else {
    grouped = int;
  }
  return (n < 0 ? "-" : "") + grouped + (dec ? `.${dec}` : "");
}

/**
 * Database dates reach the browser as "2026-10-26T23:20:00.000Z" but hold IST wall-clock time,
 * so they are read and written back as wall-clock values, with no timezone shift.
 */
export function strtotime(value: unknown): number {
  const m = String(value ?? "").match(/(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!m) {
    return 0;
  }
  return Date.UTC(+m[1]!, +m[2]! - 1, +m[3]!, +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0)) / 1000;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const pad = (n: number, len = 2) => String(n).padStart(len, "0");

/** PHP date(); with no timestamp it uses the current time in IST. */
export function date(format: string, timestamp?: number) {
  const d = new Date(timestamp === undefined ? Date.now() + 5.5 * 3_600_000 : timestamp * 1000);
  const h12 = d.getUTCHours() % 12 || 12;
  const map: Record<string, string> = {
    d: pad(d.getUTCDate()),
    j: String(d.getUTCDate()),
    m: pad(d.getUTCMonth() + 1),
    n: String(d.getUTCMonth() + 1),
    Y: String(d.getUTCFullYear()),
    y: pad(d.getUTCFullYear() % 100),
    H: pad(d.getUTCHours()),
    G: String(d.getUTCHours()),
    h: pad(h12),
    g: String(h12),
    i: pad(d.getUTCMinutes()),
    s: pad(d.getUTCSeconds()),
    A: d.getUTCHours() < 12 ? "AM" : "PM",
    a: d.getUTCHours() < 12 ? "am" : "pm",
    D: DAYS[d.getUTCDay()]!.slice(0, 3),
    l: DAYS[d.getUTCDay()]!,
    M: MONTHS[d.getUTCMonth()]!.slice(0, 3),
    F: MONTHS[d.getUTCMonth()]!,
  };
  return format.replace(/\\?[a-zA-Z]/g, (c) => (c.startsWith("\\") ? c.slice(1) : (map[c] ?? c)));
}

export const count = (v: unknown[] | null | undefined) => v?.length ?? 0;
export const max = (...v: number[]) => Math.max(...v);
export const min = (...v: number[]) => Math.min(...v);
export const round = (v: number, d = 0) => Number(v.toFixed(d));
export const strlen = (v: string) => v.length;
export const urlencode = encodeURIComponent;
export const ucfirst = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);
export const nl2br = (v: string) => v;

/** A PHP-built attribute string (`disabled`, `title="x"`) as props. */
export function attrs(value: unknown): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (const m of String(value ?? "").matchAll(/([\w-]+)(?:="([^"]*)")?/g)) {
    out[m[1]!] = m[2] ?? true;
  }
  return out;
}

/** Inline `style="x: y !important"` cannot be written as a React style object; apply it on the element itself. */
export function important(css: string) {
  return (el: HTMLElement | null) => {
    if (!el) {
      return;
    }
    for (const decl of css.split(";")) {
      const [prop, ...rest] = decl.split(":");
      if (prop?.trim() && rest.length) {
        let value = rest.join(":").replace("!important", "").trim();
        // Pages without a doctype ran in quirks mode, which read a bare number as pixels.
        if (/^-?\d*\.?\d+$/.test(value) && value !== "0" && /^(width|height|min-|max-|margin|padding|top|left|right|bottom|font-size|gap)/.test(prop.trim())) {
          value += "px";
        }
        el.style.setProperty(prop.trim(), value, "important");
      }
    }
  };
}
