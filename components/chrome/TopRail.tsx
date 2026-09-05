"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  CHOICES,
  commitChoice,
  getThemeServerSnapshot,
  getThemeSnapshot,
  subscribeTheme,
  type ThemeChoice,
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

const LABEL: Record<ThemeChoice, string> = {
  auto: "Theme: following your system. Switch to day.",
  light: "Theme: day. Switch to night.",
  dark: "Theme: night. Follow your system instead.",
};

export default function TopRail() {
  /* Both of these are values the server cannot know, so both come through
     useSyncExternalStore with a null server snapshot rather than being set
     from inside an effect. */
  const state = useSyncExternalStore(
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

  const cycle = useCallback(() => {
    if (busy.current || !state) return;
    const next = CHOICES[(CHOICES.indexOf(state.choice) + 1) % CHOICES.length];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      commitChoice(next);
      return;
    }

    busy.current = true;
    setSweeping(true);
    timers.current.push(
      window.setTimeout(() => commitChoice(next), SWEEP_SWAP),
      window.setTimeout(() => {
        setSweeping(false);
        busy.current = false;
      }, SWEEP_TOTAL),
    );
  }, [state]);

  const icon =
    state === null ? null : state.choice === "auto" ? (
      <Monitor size={15} />
    ) : state.choice === "dark" ? (
      <Moon size={15} />
    ) : (
      <Sun size={15} />
    );

  return (
    <>
      <header className="rail">
        <div className="rail__inner wrap">
          <a className="rail__mark" href="#top">
            {identity.name}
          </a>

          <div className="rail__right">
            <span className="rail__clock" title={`${identity.location} time`}>
              <span className="rail__city">BLR</span>
              <time suppressHydrationWarning>{clock ?? "--:--"}</time>
            </span>


            <button
              type="button"
              className="rail__toggle"
              onClick={cycle}
              aria-label={state ? LABEL[state.choice] : "Change theme"}
              data-choice={state?.choice}
            >
              {icon}
            </button>
          </div>
        </div>
      </header>
      <ThemeSweep running={sweeping} />
    </>
  );
}
