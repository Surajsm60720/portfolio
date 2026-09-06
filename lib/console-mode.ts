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
  labelOf,
  paintPick,
  selectables,
  showScreen,
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
  /** The cursor: which item on this page is selected, of how many, and
      what it is called. -1 is nothing selected. */
  pick: number;
  picks: number;
  pickName: string;
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

/* The cursor. Rebuilt from the DOM on every page change — see selectables()
   — so a project gaining a link gains a menu entry with nothing to update. */
let items: HTMLElement[] = [];
let pick = -1;

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
  pick: -1,
  picks: 0,
  pickName: "",
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

/** Reads the page's selectable items and puts the cursor away. */
function resetPick(): Partial<ConsoleState> {
  items = selectables();
  pick = -1;
  paintPick(items, pick);
  return { pick, picks: items.length, pickName: "" };
}

/** Moves the cursor within the page it is already on. */
function showPick(next: number): void {
  pick = next;
  paintPick(items, pick);
  publish({ pick, picks: items.length, pickName: labelOf(items[pick]) });
}

/** Moves to a page, clamped, and shows only that one. */
export function goToScreen(index: number): void {
  if (!screens.length) return;
  const at = Math.max(0, Math.min(index, screens.length - 1));
  showScreen(screens, at);
  publish({ at, where: nameOf(at), ...score(at), ...resetPick() });
}

/* ---------- the two directions ----------
   All four keys on the pad drive these two: they walk the items on the page
   and step to the next or previous page when they run out of them, which is
   what makes this a menu rather than a pager with a highlight.

   moveUp and cancelPick report failure rather than doing nothing, because
   the caller has somewhere to send you when there is nothing above: the
   sky. */

/** Down one item, or on to the next page. */
export function moveDown(): void {
  if (!screens.length) return;
  if (pick + 1 < items.length) return showPick(pick + 1);
  if (current.at + 1 < screens.length) return goToScreen(current.at + 1);
  /* The last item of the last page. There is nothing below this. */
}

/** Up one item, then off the list, then back a page. False at the very top. */
export function moveUp(): boolean {
  if (!screens.length) return false;
  if (pick >= 0) {
    showPick(pick - 1);
    return true;
  }
  if (current.at > 0) {
    goToScreen(current.at - 1);
    return true;
  }
  return false;
}

/** Activates the selected item, or advances when nothing is selected. */
export function confirmPick(): void {
  if (!screens.length) return;
  const item = items[pick];
  if (item) {
    item.click();
    return;
  }
  if (current.at + 1 < screens.length) goToScreen(current.at + 1);
}

/** Drops the selection, then goes back a page. False at the very top. */
export function cancelPick(): boolean {
  if (!screens.length) return false;
  if (pick >= 0) {
    showPick(-1);
    return true;
  }
  if (current.at > 0) {
    goToScreen(current.at - 1);
    return true;
  }
  return false;
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

  /* The attributes go on first, before anything reads the DOM below.
     Whether a page is on screen is a CSS rule keyed to data-console, so
     asking which items are visible before setting it gets the answer for
     the ordinary page: every link in the document, not the seven on the
     screen. */
  const root = document.documentElement;
  root.dataset.console = phase === "off" ? "off" : "on";
  if (phase === "opening" || phase === "closing") root.dataset.phase = phase;
  else delete root.dataset.phase;

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
    opened = { ...score(0, true), ...resetPick() };
  }
  if (phase === "off" && screens.length) {
    clearScreens(screens);
    screens = [];
    visited = [];
    areas = [];
    items = [];
    pick = -1;
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
    pick,
    picks: items.length,
    pickName: labelOf(items[pick]),
    ...opened,
    ...(phase === "off"
      ? { score: 0, found: 0, award: null, pick: -1, picks: 0, pickName: "" }
      : {}),
  };
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
