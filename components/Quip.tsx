"use client";

import { useCallback, useState } from "react";
import { quips } from "@/lib/content";

/**
 * One self-aware line under the thesis. Picked at random on mount — never on
 * the server, which would hydrate a mismatch — and cycled on click.
 *
 * Deliberately not on a timer: text that changes while you are reading it is
 * an accessibility problem, not a delight. The reader asks for the next one.
 */
export default function Quip() {
  const [index, setIndex] = useState<number | null>(null);

  /* A ref callback fires after mount, so the random pick never runs during
     render or inside an effect body. */
  const pick = useCallback((node: HTMLButtonElement | null) => {
    if (node) setIndex(Math.floor(Math.random() * quips.length));
  }, []);

  const next = useCallback(() => {
    setIndex((current) =>
      current === null ? 0 : (current + 1) % quips.length,
    );
  }, []);

  return (
    <button
      type="button"
      ref={pick}
      className="hero__quip"
      onClick={next}
      aria-live="polite"
      aria-label="Show another note about this page"
    >
      {index === null ? "" : quips[index]}
    </button>
  );
}
