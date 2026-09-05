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
export type Phase = "off" | "opening" | "on" | "closing";
export type ConsoleState = { on: boolean; phase: Phase };

/** Must match the animation lengths in globals.css. */
export const OPEN_MS = 760;
export const CLOSE_MS = 520;

const STATES: Record<Phase, ConsoleState> = {
  off: { on: false, phase: "off" },
  opening: { on: true, phase: "opening" },
  on: { on: true, phase: "on" },
  closing: { on: false, phase: "closing" },
};

let current: ConsoleState = STATES.off;
let timer: number | null = null;
const listeners = new Set<() => void>();

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
  return STATES.off;
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
  current = STATES[phase];
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
