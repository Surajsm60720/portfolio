/**
 * Whether the page is inside the handheld, and where it is in getting there.
 *
 * A module store rather than component state, because several unrelated parts
 * of the page need it: the pad, the boot overlay, and the link in the footer
 * that opens it.
 *
 * The phase exists so the mode can be animated. A console does not blink into
 * existence — it powers on, and the styles have to survive long enough for it
 * to power off again, which a plain boolean cannot express.
 */
import {
  buildScreens,
  clearScreens,
  showScreen,
  stepSection,
  type Screen,
} from "./screens";

export type Phase = "off" | "opening" | "on" | "closing";

/** The last thing the run awarded, for the HUD to pop up and forget. */
export type Award = {
  /** Ticks up on every award so the HUD can key an animation off it. */
  id: number;
  points: number;
  /** "" for an ordinary page; a banner for the ones worth announcing. */
  label: string;
};

export type ConsoleState = {
  on: boolean;
  phase: Phase;
  /** Index of the visible page, and how many there are. */
  at: number;
  total: number;
  /** The id of the section that page belongs to, spaced for display. */
  where: string;
  /** How many pages of this run have been seen, and what that scored. */
  found: number;
  score: number;
  /** Which section each page belongs to, by index — the HUD's minimap. */
  areas: number[];
  /** Whether each page has been visited this run. */
  visited: boolean[];
  award: Award | null;
};

/** Must match the animation lengths in globals.css. */
export const OPEN_MS = 760;
export const CLOSE_MS = 520;

/* The page list is built here rather than in an effect. It is derived from
   the DOM at the moment the mode opens, which is an event, not a render —
   and doing it in a component effect meant calling setState from an effect
   body, which is the cascading-render trap the lint rule exists to catch. */
let screens: Screen[] = [];

/**
 * The run.
 *
 * Console mode keeps score. Reaching a page for the first time is worth
 * points, finishing an area is worth more, and seeing everything ends the
 * run — which is the whole reason the HUD is worth looking at rather than
 * being a decorated breadcrumb.
 *
 * A run lasts one power-on. Closing the lid and opening it again starts a
 * fresh one, because an arcade machine that remembers your last game is a
 * save file, and this is not that.
 */
const PER_PAGE = 100;
const PER_AREA = 500;
const CLEARED = 2500;

let visited: boolean[] = [];
let areas: number[] = [];
let awards = 0;

const BLANK: ConsoleState = {
  on: false,
  phase: "off",
  at: 0,
  total: 0,
  where: "",
  found: 0,
  score: 0,
  areas: [],
  visited: [],
  award: null,
};

let current: ConsoleState = BLANK;
let timer: number | null = null;
const listeners = new Set<() => void>();

function publish(next: Partial<ConsoleState>) {
  current = { ...current, ...next };
  for (const listener of listeners) listener();
}

function nameOf(index: number): string {
  return (screens[index]?.section.id ?? "").replace(/-/g, " ");
}

/**
 * Scores a page the first time it is reached.
 *
 * Returns the slice of state that changed, so the caller publishes once
 * rather than the store notifying twice for one keypress.
 */
function score(at: number, quiet = false): Partial<ConsoleState> {
  if (visited[at]) return {};
  visited = visited.slice();
  visited[at] = true;

  const found = visited.filter(Boolean).length;
  let points = PER_PAGE;
  let label = "";

  /* Everything, or just this area. Checked in that order: the last page of
     the last area is both, and finishing the game is the bigger news. */
  if (found === visited.length) {
    points += CLEARED;
    label = "ALL CLEAR";
  } else {
    const area = areas[at];
    const done = areas.every((a, i) => a !== area || visited[i]);
    if (done) {
      points += PER_AREA;
      label = `AREA CLEAR · ${nameOf(at).toUpperCase()}`;
    }
  }

  awards += 1;
  return {
    visited,
    found,
    score: current.score + points,
    /* The page you power on standing on is claimed for you. It still
       scores, but announcing AREA CLEAR before a button has been pressed
       reads as the game playing itself. */
    award: { id: awards, points, label: quiet ? "" : label },
  };
}

/** Moves to a page, clamped, and shows only that one. */
export function goToScreen(index: number): void {
  if (!screens.length) return;
  const at = Math.max(0, Math.min(index, screens.length - 1));
  showScreen(screens, at);
  publish({ at, where: nameOf(at), ...score(at) });
}

/** Jumps to the first page of the neighbouring section. */
export function goToSection(dir: 1 | -1): void {
  if (!screens.length) return;
  goToScreen(stepSection(screens, current.at, dir));
}

export function screenCount(): number {
  return screens.length;
}

export function subscribeConsole(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function getConsoleSnapshot(): ConsoleState {
  return current;
}

export function getConsoleServerSnapshot(): ConsoleState {
  return BLANK;
}

/** Desktop only — a device drawn inside a phone is unusable. */
export function wideEnough(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches;
}

function reduced(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Two attributes, deliberately.
 *
 * `data-console` is the layout: it is "on" for the whole of opening, on and
 * closing, so every rule keyed to it survives the exit animation instead of
 * being pulled out from under it. `data-phase` is the movement, and only
 * exists while there is any.
 */
function commit(phase: Phase) {
  const on = phase !== "off" && phase !== "closing";
  let opened: Partial<ConsoleState> = {};

  if (on && !screens.length) {
    screens = buildScreens();
    showScreen(screens, 0);

    /* A page belongs to an area, and the areas are however many distinct
       sections the pages came from — derived here rather than counted by
       hand, so adding a section adds an area with nothing else to change. */
    const seen: HTMLElement[] = [];
    areas = screens.map(({ section }) => {
      const known = seen.indexOf(section);
      if (known !== -1) return known;
      seen.push(section);
      return seen.length - 1;
    });

    /* A fresh run, with the first page already claimed — you are standing
       on it, and a scoreboard that opens on zero reads as broken. */
    visited = new Array(screens.length).fill(false);
    awards = 0;
    current = { ...current, score: 0, found: 0, award: null };
    opened = score(0, true);
  }
  if (phase === "off" && screens.length) {
    clearScreens(screens);
    screens = [];
    visited = [];
    areas = [];
  }

  current = {
    ...current,
    on,
    phase,
    at: phase === "off" ? 0 : current.at,
    total: screens.length,
    where: screens.length ? nameOf(phase === "off" ? 0 : current.at) : "",
    areas,
    visited,
    ...opened,
    ...(phase === "off" ? { score: 0, found: 0, award: null } : {}),
  };
  const root = document.documentElement;
  root.dataset.console = phase === "off" ? "off" : "on";
  if (phase === "opening" || phase === "closing") root.dataset.phase = phase;
  else delete root.dataset.phase;
  for (const listener of listeners) listener();
}

export function setConsole(on: boolean): void {
  if (timer !== null) {
    window.clearTimeout(timer);
    timer = null;
  }
  if (current.on === on && current.phase !== "opening" && current.phase !== "closing") {
    return;
  }
  if (on) current = { ...current, at: 0 };

  /* No sequence to sit through if the reader has asked for less motion. */
  if (reduced()) {
    commit(on ? "on" : "off");
    return;
  }

  commit(on ? "opening" : "closing");
  timer = window.setTimeout(
    () => {
      timer = null;
      commit(on ? "on" : "off");
    },
    on ? OPEN_MS : CLOSE_MS,
  );
}

export function toggleConsole(): void {
  setConsole(!current.on);
}
