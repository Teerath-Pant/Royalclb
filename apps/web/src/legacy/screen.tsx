import { Suspense, lazy } from "react";
import type { ComponentType, FormEvent } from "react";

import { LegacyPage } from "./use-legacy";
import type { Handlers, LegacyStyles } from "./use-legacy";

// oxlint-disable-next-line typescript/no-explicit-any
export type View = ComponentType<Record<string, any>>;
// oxlint-disable-next-line typescript/no-explicit-any
export type Row = Record<string, any>;

export type Config = {
  /** False until the page's data has arrived. */
  ready?: boolean;
  props?: Row;
  handlers?: Handlers;
  onSubmit?: (e: FormEvent<HTMLDivElement>) => void;
};

/** A generated page module: its CSS description plus the `<Name>View` component. */
export type PageModule = { legacy: LegacyStyles } & Record<string, unknown>;
export type Loader = () => Promise<PageModule>;

/**
 * A legacy page. The generated markup is loaded as its own chunk, so opening one page does not
 * download the other thirty-odd; `useConfig` runs first and supplies the data and behaviour.
 */
export function screen(load: Loader, viewName: string, currentPage: string, useConfig?: () => Config) {
  const Page = lazy(async () => {
    const mod = await load();
    const PageView = mod[viewName] as View;
    return {
      default: function LoadedPage({ config }: { config: Config }) {
        const { props = {}, handlers, onSubmit } = config;
        return (
          <LegacyPage legacy={mod.legacy} handlers={handlers} onSubmit={onSubmit}>
            <PageView currentPage={currentPage} {...props} />
          </LegacyPage>
        );
      },
    };
  });

  return function Screen() {
    const config = useConfig?.() ?? {};
    return config.ready === false ? null : (
      <Suspense fallback={null}>
        <Page config={config} />
      </Suspense>
    );
  };
}
