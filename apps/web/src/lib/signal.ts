import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let version = 0;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Module-level state shared between the components of a page. */
export function signal<T>(initial: T) {
  let current = initial;
  return {
    get value() {
      return current;
    },
    set value(next: T) {
      if (Object.is(current, next)) {
        return;
      }
      current = next;
      version++;
      for (const listener of listeners) {
        listener();
      }
    },
  };
}

export function computed<T>(read: () => T) {
  return {
    get value() {
      return read();
    },
  };
}

/** Call in any component that reads a signal during render. */
// ponytail: one global version, so any signal change re-renders every reader. Per-signal subscriptions if that ever shows up in a profile.
export function useSignals() {
  useSyncExternalStore(subscribe, () => version);
}
