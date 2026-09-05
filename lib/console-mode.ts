/**
 * Whether the page is inside the handheld.
 *
 * A module store rather than component state, because two unrelated parts of
 * the page need it: the pad itself, and the button in the top rail that opens
 * it. The Konami code is still the way in for anyone who knows it, but an
 * easter egg with no other entrance is one most people never see.
 *
 * Same shape as lib/theme.ts — a cached snapshot so getSnapshot is stable,
 * and a null server snapshot because the server cannot know.
 */
export type ConsoleState = { on: boolean };

const OFF: ConsoleState = { on: false };
const ON: ConsoleState = { on: true };

let current: ConsoleState = OFF;
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
  return OFF;
}

/** Desktop only — a device drawn inside a phone is unusable. */
export function wideEnough(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches;
}

export function setConsole(on: boolean): void {
  const next = on ? ON : OFF;
  if (next === current) return;
  current = next;
  document.documentElement.dataset.console = on ? "on" : "off";
  for (const listener of listeners) listener();
}

export function toggleConsole(): void {
  setConsole(!current.on);
}
