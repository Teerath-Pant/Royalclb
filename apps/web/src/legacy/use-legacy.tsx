import { useEffect, useLayoutEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";

import tailwindCss from "@/tailwind.css?inline";

import { go } from "./php";

export type LegacyStyles = {
  /** Stylesheet URLs the original page linked in its <head>. */
  stylesheets: string[];
  /** The page's own <style> blocks. */
  inlineCss?: string;
  /** Pages that ran a Preact script also loaded the Tailwind build, whose base styles then reach the whole page. */
  tailwind?: boolean;
  /** Inline style of <html> and <body>; the legacy CSS sizes everything in rem from here. */
  htmlStyle?: string;
  bodyStyle?: string;
  /** `data-dpr` of <html>. The game pages read it as their round interval. */
  dpr?: string;
};

function createLink(href: string) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  return link;
}

function whenLoaded(link: HTMLLinkElement) {
  return new Promise<void>((resolve) => {
    link.onload = () => resolve();
    link.onerror = () => resolve();
    setTimeout(resolve, 4000);
  });
}

/**
 * Applies a page's original stylesheets for as long as it is mounted and removes them after,
 * so the Tailwind pages and the legacy pages never style each other. Returns true once they loaded.
 */
export function useLegacyStyles({ stylesheets, inlineCss, tailwind, htmlStyle, bodyStyle, dpr }: LegacyStyles) {
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const before = { html: html.getAttribute("style"), body: document.body.getAttribute("style") };
    // The legacy CSS lays out <body> > #app directly, so the app's own #root wrapper must not take part.
    const root = document.getElementById("root");
    const rootDisplay = root?.style.display ?? "";
    if (root && (htmlStyle || bodyStyle)) {
      root.style.display = "contents";
    }
    let cancelled = false;
    const added: HTMLElement[] = [];

    if (htmlStyle) {
      html.setAttribute("style", htmlStyle);
      html.dataset.dpr = dpr ?? "1";
    }
    if (bodyStyle) {
      document.body.setAttribute("style", bodyStyle);
    }
    const hrefs = tailwind ? [...stylesheets, "/styles/notyf.min.css", "/styles/helpers.css"] : stylesheets;
    // Appended in the order the PHP pages had: sheets, then Tailwind, then the page's own <style>.
    const links = hrefs.map(createLink);
    document.head.append(...links);
    added.push(...links);
    for (const css of [tailwind ? tailwindCss : "", inlineCss ?? ""]) {
      if (css) {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.append(style);
        added.push(style);
      }
    }

    void Promise.all(links.map(whenLoaded)).then(() => {
      if (!cancelled) {
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
      for (const el of added) {
        el.remove();
      }
      for (const [el, value] of [[html, before.html], [document.body, before.body]] as const) {
        if (value === null) {
          el.removeAttribute("style");
        } else {
          el.setAttribute("style", value);
        }
      }
      delete html.dataset.dpr;
      if (root) {
        root.style.display = rootDisplay;
      }
    };
  }, [stylesheets, inlineCss, tailwind, htmlStyle, bodyStyle, dpr]);

  return ready;
}

export type Handlers = Record<string, (arg: string) => void>;

/** Same-origin <a> clicks stay inside the app instead of reloading it. */
function interceptLinks(e: MouseEvent) {
  const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") {
    return;
  }
  const url = new URL(a.href, window.location.href);
  if (url.origin === window.location.origin && !a.hasAttribute("download") && !a.getAttribute("href")?.startsWith("#")) {
    e.preventDefault();
    go(url.pathname + url.search + url.hash);
  }
}

/** The compiled markup keeps inline `onclick="fn(arg)"` calls as data attributes; these dispatch them to `handlers`. */
function runInlineHandler(e: MouseEvent, handlers: Handlers) {
  const el = (e.target as Element | null)?.closest?.("[data-todo-onclick]");
  const call = /^\s*(\w+)\((.*?)\)/.exec(el?.getAttribute("data-todo-onclick") ?? "");
  if (call) {
    handlers[call[1]!]?.(call[2]!.replaceAll(/^['"]|['"]$/g, ""));
  }
}

export function LegacyPage({
  legacy,
  handlers = {},
  onSubmit,
  children,
}: {
  legacy: LegacyStyles;
  handlers?: Handlers;
  onSubmit?: (e: FormEvent<HTMLDivElement>) => void;
  children: ReactNode;
}) {
  const ready = useLegacyStyles(legacy);

  // The old pages hid their "loadingloader" overlay one second after load.
  useEffect(() => {
    if (!ready) {
      return;
    }
    const timer = setTimeout(() => {
      const loader = document.getElementById("loadingloader");
      if (loader) {
        loader.style.display = "none";
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [ready]);

  return ready ? (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      onClick={(e) => {
        interceptLinks(e.nativeEvent);
        runInlineHandler(e.nativeEvent, handlers);
      }}
      onSubmit={onSubmit}
      role="presentation"
      style={{ display: "contents" }}
    >
      {children}
    </div>
  ) : null;
}
