"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/**
 * What is above the top of the page.
 *
 * Pressing up scrolls back to the beginning and then keeps going. The sense
 * of still travelling upward comes from the stars arriving as long vertical
 * streaks falling downward — the world moving the opposite way to you — which
 * then shorten into points and begin to twinkle. A single line follows.
 *
 * The streak is `scaleY` on a fixed 2px dot, never an animated height, so the
 * whole sequence is transform and opacity and never touches layout.
 *
 * Positions are a fixed list rather than randomised: the same sky every time,
 * and nothing to hydrate.
 */
const STARS: [number, number, number][] = [
  [6, 18, 1], [13, 42, 0], [19, 9, 2], [24, 63, 1], [29, 28, 0], [34, 77, 2],
  [38, 15, 1], [43, 51, 0], [47, 34, 2], [52, 71, 1], [56, 12, 0], [61, 45, 2],
  [66, 24, 1], [70, 84, 0], [74, 38, 2], [79, 17, 1], [83, 59, 0], [88, 30, 2],
  [92, 73, 1], [95, 21, 0], [9, 66, 2], [16, 88, 1], [27, 5, 0], [41, 92, 2],
  [58, 88, 1], [72, 60, 0], [86, 8, 2], [98, 48, 1], [3, 37, 0], [50, 6, 2],
  [11, 26, 1], [36, 40, 2], [64, 70, 0], [81, 44, 1], [90, 90, 2], [21, 54, 0],
];

export default function NightSky({
  open,
  line,
  onClose,
}: {
  open: boolean;
  /** Chosen by whoever opens it — an event handler, never an effect. */
  line: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    /* Without this the page behind keeps scrolling under a full-screen
       panel, so the reader moves content they cannot see. */
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      className="sky"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="Above the top of the page"
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <div className="sky__field" aria-hidden="true">
        {STARS.map(([x, y, lane], i) => (
          <span
            key={i}
            className="sky__star"
            data-lane={lane}
            style={
              {
                left: `${x}%`,
                top: `${y}%`,
                "--d": `${(i % 9) * 55}ms`,
                "--tw": `${(i % 6) * 1.1}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <button
        type="button"
        className="sky__close"
        onClick={onClose}
        ref={closeRef}
        aria-label="Close and return to the page"
      >
        <X size={15} aria-hidden="true" />
      </button>

      <p className="sky__line">{line}</p>
    </div>
  );
}
