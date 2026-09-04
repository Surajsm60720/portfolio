import { isNight, istHour } from "./time";

export type Theme = "light" | "dark";

export const STORAGE_KEY = "portfolio-theme";

/**
 * Resolution order: an explicit choice the visitor made, else the clock.
 * `prefers-color-scheme` is deliberately not consulted — the whole idea is
 * that the theme reports what time it is in Bengaluru.
 */
export function resolveTheme(): Theme {
  const stored = readStored();
  if (stored) return stored;
  return isNight(istHour()) ? "dark" : "light";
}

export function readStored(): Theme | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "light" || raw === "dark" ? raw : null;
  } catch {
    // Private mode, blocked storage — fall through to the clock.
    return null;
  }
}

export function writeStored(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Nothing to do; the clock still governs on the next load.
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}

/* ------------------------------------------------------------------ store

   The theme is a value the server cannot know: it depends on localStorage
   and on the current hour in Bengaluru. That is exactly what
   useSyncExternalStore is for — a server snapshot of null (render the
   neutral placeholder) and a client snapshot resolved on hydration, with no
   setState inside an effect.

   The snapshot is cached because getSnapshot must be referentially stable
   between renders; recomputing it on every call would loop. */

const listeners = new Set<() => void>();
let current: Theme | null = null;

export function subscribeTheme(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function getThemeSnapshot(): Theme {
  if (current === null) current = resolveTheme();
  return current;
}

/** Nothing renders theme-dependent markup on the server. */
export function getThemeServerSnapshot(): null {
  return null;
}

/** Commits a new theme: persists it, paints it, and notifies subscribers. */
export function commitTheme(next: Theme): void {
  current = next;
  writeStored(next);
  applyTheme(next);
  for (const listener of listeners) listener();
}

/**
 * Runs inline in <head> before first paint so the correct palette is on the
 * html element before anything renders. Kept small and dependency-free on
 * purpose: it is inlined as a string, not bundled.
 *
 * IST is UTC+05:30 year-round with no DST, so the offset arithmetic here and
 * the Intl-based lookup in lib/time.ts always agree.
 *
 * It also stamps data-js on <html>. Scroll-reveal hides its content until an
 * observer shows it, which without this flag means a failed or disabled
 * script leaves most of the page blank. The hidden state is opt-in: no
 * script, no hiding.
 */
export const PREPAINT_SCRIPT = `(function(){
document.documentElement.dataset.js="1";
try{
var s=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
if(s!=="light"&&s!=="dark"){var h=new Date(Date.now()+19800000).getUTCHours();s=(h>=19||h<6)?"dark":"light";}
document.documentElement.dataset.theme=s;
}catch(e){document.documentElement.dataset.theme="dark";}})();`;
