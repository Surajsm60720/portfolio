"use client";

import { useSyncExternalStore } from "react";
import {
  getSalutationServerSnapshot,
  getSalutationSnapshot,
  subscribeSalutation,
} from "@/lib/greeting";

/**
 * The page holds two clocks. The theme runs on Suraj's; this greeting runs on
 * yours, down to what your particular hour is generally like. Saying both out
 * loud is the point — a portfolio that greets you by your own hour and then
 * reports its author's is being accurate, not clever.
 *
 * Renders nothing before hydration. A server-rendered "Good morning" would be
 * wrong for most of the planet.
 */
export default function Greeting() {
  const now = useSyncExternalStore(
    subscribeSalutation,
    getSalutationSnapshot,
    getSalutationServerSnapshot,
  );

  if (!now) return null;

  const { greeting, note, theirClock, dayShift, bothLate } = now;

  const gap = bothLate
    ? `it is ${theirClock} where he is, so this is late for both of us`
    : dayShift === 1
      ? `it is already ${theirClock} tomorrow where he is`
      : dayShift === -1
        ? `it is still ${theirClock} yesterday where he is`
        : `it is ${theirClock} where he is`;

  return (
    <div className="hero__hail">
      <p className="hero__greeting">
        <span className="hero__hello">{greeting}.</span>{" "}
        <span className="hero__note">{note}</span>
      </p>
      <p className="hero__gap">Right now {gap}.</p>
    </div>
  );
}
