import { navigate as routerNavigate } from "wouter/use-browser-location";

type NavigateOptions = {
  replace?: boolean;
  search?: Record<string, string | number>;
};

export function navigate(path: string, options: NavigateOptions = {}) {
  const query = new URLSearchParams(
    Object.entries(options.search ?? {}).map(([k, v]) => [k, String(v)])
  ).toString();
  routerNavigate(query ? `${path}?${query}` : path, {
    replace: options.replace,
  });
}

export function back(fallback = "/wallet") {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    navigate(fallback);
  }
}

export function getSearchParam(key: string) {
  return new URLSearchParams(window.location.search).get(key);
}
