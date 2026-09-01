"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, resolveTheme, writeStored, type Theme } from "@/lib/theme";
import { istClock } from "@/lib/time";
import { identity } from "@/lib/content";
import ThemeSweep from "./ThemeSweep";

/** Sweep is 520ms total; the palette swaps at 220ms, behind the bright edge. */
const SWEEP_TOTAL = 520;
const SWEEP_SWAP = 220;

export default function TopRail() {
  /* Server render must not depend on the clock, so both the time and the
     toggle icon start neutral and settle on mount. */
  const [clock, setClock] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [sweeping, setSweeping] = useState(false);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setTheme(resolveTheme());
    setClock(istClock());
    const tick = window.setInterval(() => setClock(istClock()), 10_000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  const toggle = useCallback(() => {
    if (busy.current || !theme) return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    writeStored(next);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      applyTheme(next);
      setTheme(next);
      return;
    }

    busy.current = true;
    setSweeping(true);
    timers.current.push(
      window.setTimeout(() => {
        applyTheme(next);
        setTheme(next);
      }, SWEEP_SWAP),
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
              aria-label={
                isDark ? "Switch to day theme" : "Switch to night theme"
              }
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
