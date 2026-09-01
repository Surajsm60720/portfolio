"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import {
  commitTheme,
  getThemeServerSnapshot,
  getThemeSnapshot,
  subscribeTheme,
  type Theme,
} from "@/lib/theme";
import { istClock } from "@/lib/time";
import { identity } from "@/lib/content";
import ThemeSweep from "./ThemeSweep";

/** Sweep is 520ms total; the palette swaps at 220ms, behind the bright edge. */
const SWEEP_TOTAL = 520;
const SWEEP_SWAP = 220;

/** Ten seconds is plenty for a display that only shows hours and minutes. */
function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(id);
}

export default function TopRail() {
  /* Both of these are values the server cannot know, so both come through
     useSyncExternalStore with a null server snapshot rather than being set
     from inside an effect. */
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const clock = useSyncExternalStore(subscribeClock, istClock, () => null);

  const [sweeping, setSweeping] = useState(false);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  const toggle = useCallback(() => {
    if (busy.current || !theme) return;
    const next: Theme = theme === "dark" ? "light" : "dark";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      commitTheme(next);
      return;
    }

    busy.current = true;
    setSweeping(true);
    timers.current.push(
      window.setTimeout(() => commitTheme(next), SWEEP_SWAP),
      window.setTimeout(() => {
        setSweeping(false);
        busy.current = false;
      }, SWEEP_TOTAL),
    );
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <>
      <header className="rail">
        <div className="rail__inner wrap">
          <a className="rail__mark" href="#top">
            {identity.name}
          </a>

          <div className="rail__right">
            {/* The clock is the argument for the theme, so it sits next to it. */}
            <span className="rail__clock" title={`${identity.location} time`}>
              <span className="rail__city">BLR</span>
              <time suppressHydrationWarning>{clock ?? "--:--"}</time>
            </span>

            <button
              type="button"
              className="rail__toggle"
              onClick={toggle}
              aria-label={isDark ? "Switch to day theme" : "Switch to night theme"}
              aria-pressed={isDark}
            >
              {theme === null ? null : isDark ? <Moon size={15} /> : <Sun size={15} />}
            </button>
          </div>
        </div>
      </header>
      <ThemeSweep running={sweeping} />
    </>
  );
}
