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
export type ConsoleState = {
  on: boolean;
  phase: Phase;
  /** Index of the visible page, and how many there are. */
  at: number;
  total: number;
  /** The id of the section that page belongs to, spaced for display. */
  where: string;
};

/** Must match the animation lengths in globals.css. */
export const OPEN_MS = 760;
export const CLOSE_MS = 520;

/* The page list is built here rather than in an effect. It is derived from
   the DOM at the moment the mode opens, which is an event, not a render —
   and doing it in a component effect meant calling setState from an effect
   body, which is the cascading-render trap the lint rule exists to catch. */
let screens: Screen[] = [];
let current: ConsoleState = { on: false, phase: "off", at: 0, total: 0, where: "" };
let timer: number | null = null;
const listeners = new Set<() => void>();

function publish(next: Partial<ConsoleState>) {
  current = { ...current, ...next };
  for (const listener of listeners) listener();
}

function nameOf(index: number): string {
  return (screens[index]?.section.id ?? "").replace(/-/g, " ");
}

/** Moves to a page, clamped, and shows only that one. */
export function goToScreen(index: number): void {
  if (!screens.length) return;
  const at = Math.max(0, Math.min(index, screens.length - 1));
  showScreen(screens, at);
  publish({ at, where: nameOf(at) });
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

const SERVER: ConsoleState = { on: false, phase: "off", at: 0, total: 0, where: "" };

export function getConsoleServerSnapshot(): ConsoleState {
  return SERVER;
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

  if (on && !screens.length) {
    screens = buildScreens();
    showScreen(screens, 0);
  }
  if (phase === "off" && screens.length) {
    clearScreens(screens);
    screens = [];
  }

  current = {
    on,
    phase,
    at: phase === "off" ? 0 : current.at,
    total: screens.length,
    where: screens.length ? nameOf(phase === "off" ? 0 : current.at) : "",
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
