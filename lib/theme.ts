import { isNight, istHour } from "./time";

/** What the reader has asked for. "auto" defers to the operating system. */
export type ThemeChoice = "auto" | "light" | "dark";
export type Theme = "light" | "dark";

export const STORAGE_KEY = "portfolio-theme";
export const CHOICES: ThemeChoice[] = ["auto", "light", "dark"];

/**
 * Resolution order: an explicit choice, else the operating system, else the
 * hour in Bengaluru.
 *
 * The clock used to decide this outright and prefers-color-scheme was
 * deliberately ignored. That was wrong. A reader who has set their whole
 * machine to dark has expressed a preference about their eyes, and a
 * portfolio's conceit does not outrank it. The clock keeps the last word only
 * where the system expresses nothing at all, which is rare.
 */
export function systemTheme(): Theme | null {
  if (typeof window === "undefined" || !window.matchMedia) return null;
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return null;
}

export function resolve(choice: ThemeChoice): Theme {
  if (choice !== "auto") return choice;
  return systemTheme() ?? (isNight(istHour()) ? "dark" : "light");
}

export function readStored(): ThemeChoice {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "light" || raw === "dark" || raw === "auto" ? raw : "auto";
  } catch {
    // Private mode, blocked storage — auto is the right default anyway.
    return "auto";
  }
}

function writeStored(choice: ThemeChoice): void {
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Nothing to do; the next load falls back to auto.
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

/* ------------------------------------------------------------------ store

   The active theme is a value the server cannot know: it depends on
   localStorage, on the operating system, and on the current hour in
   Bengaluru. That is what useSyncExternalStore is for — a server snapshot of
   null and a client snapshot resolved on hydration, with no setState inside
   an effect.

   The snapshot is cached because getSnapshot must be referentially stable
   between renders; recomputing it on every call would loop. */

export interface ThemeState {
  choice: ThemeChoice;
  theme: Theme;
}

const listeners = new Set<() => void>();
let current: ThemeState | null = null;
let media: MediaQueryList | null = null;

function pull(): boolean {
  const choice = current?.choice ?? readStored();
  const theme = resolve(choice);
  if (current && current.choice === choice && current.theme === theme) return false;
  current = { choice, theme };
  return true;
}

function onSystemChange() {
  /* Only auto follows the system; an explicit choice stays put. */
  if (current && current.choice !== "auto") return;
  if (!pull()) return;
  applyTheme(current!.theme);
  for (const listener of listeners) listener();
}

export function subscribeTheme(onChange: () => void): () => void {
  listeners.add(onChange);
  if (listeners.size === 1 && typeof window !== "undefined" && window.matchMedia) {
    media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", onSystemChange);
  }
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && media) {
      media.removeEventListener("change", onSystemChange);
      media = null;
    }
  };
}

export function getThemeSnapshot(): ThemeState {
  /* getSnapshot runs during render, so it caches but never notifies —
     notifying from here would be a render-phase side effect. */
  if (current === null) pull();
  return current!;
}

/** Nothing renders theme-dependent markup on the server. */
export function getThemeServerSnapshot(): null {
  return null;
}

/** Commits a new choice: persists it, paints it, and notifies subscribers. */
export function commitChoice(choice: ThemeChoice): void {
  writeStored(choice);
  current = { choice, theme: resolve(choice) };
  applyTheme(current.theme);
  for (const listener of listeners) listener();
}

/**
 * Runs inline in <head> before first paint so the correct palette is on the
 * html element before anything renders. Kept small and dependency-free on
 * purpose: it is inlined as a string, not bundled.
 *
 * It also stamps data-js on <html>. Scroll-reveal hides its content until an
 * observer shows it, which without this flag means a failed or disabled
 * script leaves most of the page blank. The hidden state is opt-in: no
 * script, no hiding.
 *
 * IST is UTC+05:30 year-round with no DST, so the offset arithmetic here and
 * the Intl-based lookup in lib/time.ts always agree.
 */
export const PREPAINT_SCRIPT = `(function(){
document.documentElement.dataset.js="1";
try{
var c=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
var t=(c==="light"||c==="dark")?c:null;
if(!t&&window.matchMedia){
if(window.matchMedia("(prefers-color-scheme: dark)").matches)t="dark";
else if(window.matchMedia("(prefers-color-scheme: light)").matches)t="light";
}
if(!t){var h=new Date(Date.now()+19800000).getUTCHours();t=(h>=19||h<6)?"dark":"light";}
document.documentElement.dataset.theme=t;
}catch(e){document.documentElement.dataset.theme="dark";}})();`;
