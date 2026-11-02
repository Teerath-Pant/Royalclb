import { useEffect, useState } from "react";

/** Fullscreen toggle and the "rotate your phone" overlay of the landscape games. */
export function useFullscreen() {
  const [fullscreen, setFullscreen] = useState(false);
  const [portrait, setPortrait] = useState(window.innerHeight > window.innerWidth);
  const supported = document.fullscreenEnabled;

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    const onResize = () => setPortrait(window.innerHeight > window.innerWidth);
    document.addEventListener("fullscreenchange", onChange);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  const toggle = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        screen.orientation?.unlock?.();
      } else {
        await document.documentElement.requestFullscreen();
        // Not every browser can lock the orientation; the game still works without it.
        await (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock?.("landscape").catch(() => {});
      }
    } catch (error) {
      console.error("Fullscreen failed:", error);
    }
  };

  return { fullscreen, portrait, supported, toggle };
}
