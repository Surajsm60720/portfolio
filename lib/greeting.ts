/**
 * The page's second clock.
 *
 * lib/time.ts is Suraj's clock — Bengaluru, and it picks the theme. This one
 * is *yours*, read off the system time, and it exists to say so out loud: the
 * site greets you on your hours while reporting his. When the two disagree,
 * the greeting says by how much, which is the honest version of a portfolio
 * pretending it knows who is reading it.
 *
 * External store rather than effect state, for the same reason as the theme:
 * the server cannot know the visitor's clock, and getSnapshot has to return a
 * stable reference between ticks.
 */
import { hourNotes } from "./content";
import { TZ, istClock } from "./time";

export interface Salutation {
  /** "Good evening" — banded on the visitor's local hour. */
  greeting: string;
  /** What that hour is generally like. Keyed to the visitor, never to Suraj. */
  note: string;
  /** Suraj's wall-clock time, "HH:MM". */
  theirClock: string;
  /** -1 yesterday, 0 same day, +1 tomorrow — his date relative to yours. */
  dayShift: -1 | 0 | 1;
  /** True when it is late for both of you, which deserves its own line. */
  bothLate: boolean;
}

function band(hour: number): string {
  if (hour < 5) return "Up late";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 22) return "Good evening";
  return "Up late";
}

const isoDate = (tz?: string) =>
  new Intl.DateTimeFormat("en-CA", tz ? { timeZone: tz } : undefined);

function compute(): Salutation {
  const now = new Date();
  const hour = now.getHours();

  const theirs = isoDate(TZ).format(now);
  const yours = isoDate().format(now);
  const dayShift: -1 | 0 | 1 =
    theirs === yours ? 0 : theirs > yours ? 1 : -1;

  const theirHour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      hour: "2-digit",
      hour12: false,
    }).format(now),
  );

  const late = (h: number) => h >= 22 || h < 5;

  return {
    greeting: band(hour),
    note: hourNotes[hour],
    theirClock: istClock(now),
    dayShift,
    bothLate: late(hour) && late(theirHour),
  };
}

let snapshot: Salutation | null = null;
let key = "";
const listeners = new Set<() => void>();
let timer: number | null = null;

const keyOf = (s: Salutation) =>
  `${s.greeting}|${s.note}|${s.theirClock}|${s.dayShift}|${s.bothLate}`;

/** Recomputes and caches. Returns true when a reader would notice a change. */
function pull(): boolean {
  const next = compute();
  const nextKey = keyOf(next);
  /* Only swap the reference when something visible changed — otherwise every
     tick re-renders the hero for nothing. */
  if (nextKey === key) return false;
  key = nextKey;
  snapshot = next;
  return true;
}

function refresh() {
  if (!pull()) return;
  for (const listener of listeners) listener();
}

export function subscribeSalutation(onChange: () => void): () => void {
  listeners.add(onChange);
  if (listeners.size === 1) {
    refresh();
    timer = window.setInterval(refresh, 30_000);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };
}

export function getSalutationSnapshot(): Salutation | null {
  /* getSnapshot runs during render, so it caches but never notifies —
     notifying from here would be a render-phase side effect. */
  if (snapshot === null) pull();
  return snapshot;
}

export function getSalutationServerSnapshot(): null {
  return null;
}
