"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NightSky from "./NightSky";

/**
 * A four-way pad, drawn as pixel art in SVG rather than shipped as an image
 * — theme-aware, crisp at any size, one request fewer.
 *
 * It never binds the arrow keys globally. Overriding them would break the
 * browser's own scrolling for every keyboard user, which costs far more than
 * this control is worth. The pad is a focusable group and arrows drive it
 * only while focus is inside it.
 *
 * Left and right are placeholders. Change ACTIONS and nothing else moves.
 */
type Dir = "up" | "down" | "left" | "right";

const ACTIONS: Record<Dir, string> = {
  up: "Up past the top",
  down: "Next section",
  left: "Previous section",
  right: "Jump to contact",
};

/** Every landmark the pad can move between, in document order. */
function stops(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("main section[id], footer[id]"),
  );
}

function currentIndex(all: HTMLElement[]): number {
  const probe = window.scrollY + window.innerHeight * 0.3;
  let index = 0;
  all.forEach((el, i) => {
    if (el.offsetTop <= probe) index = i;
  });
  return index;
}

/* Eight rects on a 12x12 grid, pointing up. The other three directions are
   this shape rotated in CSS — four hand-written paths would be four chances
   to get the geometry subtly wrong, and the first draft proved it. */
const ARROW: [number, number, number][] = [
  [5, 2, 2], [4, 3, 4], [3, 4, 6], [2, 5, 8],
  [5, 6, 2], [5, 7, 2], [5, 8, 2], [5, 9, 2],
];

export default function DPad() {
  const [skyOpen, setSkyOpen] = useState(false);
  const [hint, setHint] = useState<Dir | null>(null);
  const [at, setAt] = useState(0);
  const [total, setTotal] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  /* The hub reads as a position indicator rather than a dead centre piece. */
  useEffect(() => {
    const read = () => {
      const all = stops();
      setTotal(all.length);
      setAt(currentIndex(all));
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  const go = useCallback((dir: Dir) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    const all = stops();

    if (dir === "up") {
      /* Scroll back to the beginning first, then keep going — the sky only
         arrives once there is nowhere left to scroll. */
      if (window.scrollY < 4) {
        setSkyOpen(true);
        return;
      }
      window.scrollTo({ top: 0, behavior });
      timers.current.push(
        window.setTimeout(() => setSkyOpen(true), reduced ? 60 : 520),
      );
      return;
    }

    if (dir === "right") {
      window.scrollTo({ top: document.body.scrollHeight, behavior });
      return;
    }

    const i = currentIndex(all);
    const next = dir === "down" ? Math.min(i + 1, all.length - 1) : Math.max(i - 1, 0);
    all[next]?.scrollIntoView({ behavior, block: "start" });
  }, []);

  /* Arrows work here and only here — focus has to be inside the pad. */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      go(dir);
    },
    [go],
  );

  const key = (dir: Dir) => (
    <button
      type="button"
      className={`dpad__key dpad__key--${dir}`}
      onClick={() => go(dir)}
      onPointerEnter={() => setHint(dir)}
      onPointerLeave={() => setHint(null)}
      onFocus={() => setHint(dir)}
      onBlur={() => setHint(null)}
      aria-label={ACTIONS[dir]}
    >
      <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        {ARROW.map(([x, y, w]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={w}
            height={1}
            fill="currentColor"
            shapeRendering="crispEdges"
          />
        ))}
      </svg>
    </button>
  );

  return (
    <>
      <div
        className="dpad"
        role="group"
        aria-label="Page navigation pad"
        onKeyDown={onKeyDown}
      >
        {key("up")}
        {key("left")}
        <span className="dpad__hub" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span className="dpad__pip" key={i} data-on={i <= at} />
          ))}
        </span>
        {key("right")}
        {key("down")}
      </div>

      <p className="dpad__hint" aria-live="polite">
        {hint ? ACTIONS[hint] : "Arrow keys work while it has focus."}
      </p>

      <NightSky open={skyOpen} onClose={() => setSkyOpen(false)} />
    </>
  );
}
