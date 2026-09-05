"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import StarBurst, { makeStars, type Star } from "./StarBurst";

/**
 * A four-way pad, drawn as pixel art in SVG rather than shipped as an image
 * — theme-aware, crisp at any size, one request fewer.
 *
 * It never touches the arrow keys globally. Overriding them would break the
 * browser's own scrolling for everyone using a keyboard, which is a far
 * larger loss than this control is a gain. The pad is a focusable group and
 * arrows drive it only while focus is inside it.
 *
 * Left and right are placeholders. Change ACTIONS and nothing else moves.
 */
type Dir = "up" | "down" | "left" | "right";

const STAR_MS = 900;

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

export default function DPad() {
  const [stars, setStars] = useState<Star[]>([]);
  const [pressed, setPressed] = useState<Dir | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  const go = useCallback((dir: Dir) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    const all = stops();

    setPressed(dir);
    timers.current.push(window.setTimeout(() => setPressed(null), 180));

    if (dir === "up") {
      /* The stars are the reward for going all the way back. */
      if (!reduced) {
        setStars(makeStars());
        timers.current.push(window.setTimeout(() => setStars([]), STAR_MS));
      }
      window.scrollTo({ top: 0, behavior });
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

  /* One arrow, drawn as pixels on a 12x12 grid and pointing up. The other
     three are the same shape rotated in CSS — four hand-built paths would be
     four chances to get the geometry subtly wrong. */
  const ARROW: [number, number, number][] = [
    [5, 2, 2],
    [4, 3, 4],
    [3, 4, 6],
    [2, 5, 8],
    [5, 6, 2],
    [5, 7, 2],
    [5, 8, 2],
    [5, 9, 2],
  ];

  const button = (dir: Dir, label: string) => (
    <button
      type="button"
      className={`dpad__key dpad__key--${dir}`}
      onClick={() => go(dir)}
      aria-label={label}
      data-pressed={pressed === dir}
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
        {button("up", "Back to the top")}
        {button("left", "Previous section")}
        <span className="dpad__hub" aria-hidden="true" />
        {button("right", "Jump to contact")}
        {button("down", "Next section")}
      </div>
      <StarBurst stars={stars} />
    </>
  );
}
