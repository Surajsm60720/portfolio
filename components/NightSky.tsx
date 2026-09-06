"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Starfield from "./Starfield";

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
 * The field itself is components/Starfield.tsx — the console's backdrop is
 * the same sky, and one list keeps the two from drifting apart.
 */

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
      <Starfield variant="sky" />


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
