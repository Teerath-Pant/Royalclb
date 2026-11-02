/** Pages whose markup is driven by Alpine.js (register, bet report): the rendered HTML is kept as it was. */
import Alpine from "alpinejs";
import mask from "@alpinejs/mask";
import { useEffect, useRef } from "react";

import { LegacyPage } from "./use-legacy";
import type { LegacyStyles } from "./use-legacy";

let started = false;

/** Alpine starts once for the whole app; pages mounted later are initialised with initTree. */
export function startAlpine(setup: () => void) {
  if (!started) {
    Alpine.plugin(mask);
    started = true;
  }
  setup();
}

function Markup({ html, setup }: { html: string; setup: () => void }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) {
      return;
    }
    startAlpine(setup);
    Alpine.initTree(el);
    return () => Alpine.destroyTree(el);
  }, [setup]);

  // oxlint-disable-next-line react/no-danger
  return <div ref={host} style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function AlpinePage({ html, legacy, setup }: { html: string; legacy: LegacyStyles; setup: () => void }) {
  return (
    <LegacyPage legacy={legacy}>
      <Markup html={html} setup={setup} />
    </LegacyPage>
  );
}
