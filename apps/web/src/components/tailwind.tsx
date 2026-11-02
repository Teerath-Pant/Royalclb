import type { ReactNode } from "react";

import { useLegacyStyles } from "@/legacy/use-legacy";
import tailwindCss from "@/tailwind.css?inline";

const styles = {
  stylesheets: ["/styles/notyf.min.css", "/styles/helpers.css"],
  inlineCss: tailwindCss,
};

/** The Tailwind pages style themselves from this sheet only while mounted, so it never leaks into the legacy pages. */
export function Tailwind({ children }: { children: ReactNode }) {
  const ready = useLegacyStyles(styles);
  return ready ? children : null;
}
