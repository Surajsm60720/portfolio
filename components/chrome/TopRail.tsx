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
import { identity } from "@/lib/content";
import ThemeSweep from "./ThemeSweep";

/** Sweep is 520ms total; the palette swaps at 220ms, behind the bright edge. */
const SWEEP_TOTAL = 520;
const SWEEP_SWAP = 220;

const LABEL: Record<ThemeChoice, string> = {
  auto: "Theme: following your system. Switch to day.",
  light: "Theme: day. Switch to night.",
  dark: "Theme: night. Follow your system instead.",
};

export default function TopRail() {
  /* A value the server cannot know, so it comes through useSyncExternalStore
     with a null server snapshot rather than being set from inside an
     effect. */
  const state = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
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
