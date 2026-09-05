"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { offTheClock } from "@/lib/content";

/**
 * What is above the top of the page.
 *
 * Pressing up on the pad scrolls back to the beginning and then keeps going:
 * a night sky arrives from overhead and the page slides down under it. It is
 * the after-hours half of the person, reachable only by deliberately going
 * back past the start — which is the whole joke.
 *
 * Stars are seeded once from a fixed list rather than randomised, so the sky
 * is the same sky every time and there is nothing to hydrate.
 */
const STARS = [
  [6, 18, 2], [13, 42, 1], [19, 9, 2], [24, 63, 1], [29, 28, 3], [34, 77, 1],
  [38, 15, 1], [43, 51, 2], [47, 34, 1], [52, 71, 2], [56, 12, 1], [61, 45, 3],
  [66, 24, 1], [70, 84, 1], [74, 38, 2], [79, 17, 1], [83, 59, 1], [88, 30, 2],
  [92, 73, 1], [95, 21, 1], [9, 66, 1], [16, 88, 2], [27, 5, 1], [41, 92, 1],
  [58, 88, 1], [72, 60, 1], [86, 8, 1], [98, 48, 2], [3, 37, 1], [50, 6, 1],
] as const;

export default function NightSky({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    /* Without this the page behind keeps scrolling under a full-screen
       panel, so the reader moves content they cannot see and comes back
       somewhere else entirely. */
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
      aria-label="Off the clock"
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <div className="sky__field" aria-hidden="true">
        {STARS.map(([x, y, size], i) => (
          <span
            key={i}
            className="sky__star"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${(i % 7) * 0.9}s`,
            }}
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

      <div className="sky__inner wrap">
        <p className="sky__eyebrow">Off the clock</p>
        <p className="sky__lede">
          You went up past the top. This is the rest of the input.
        </p>

        <ul className="sky__list">
          {offTheClock.map((aside) => (
            <li className="sky__item" key={aside.label}>
              <p className="sky__label">{aside.label}</p>
              <p className="sky__body">{aside.body}</p>
              {aside.href ? (
                <a
                  className="sky__link"
                  href={aside.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {aside.hrefLabel ?? "Link"}
                  <ArrowUpRight size={11} aria-hidden="true" />
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
