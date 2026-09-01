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

/**
 * Runs inline in <head> before first paint so the correct palette is on the
 * html element before anything renders. Kept small and dependency-free on
 * purpose: it is inlined as a string, not bundled.
 *
 * IST is UTC+05:30 year-round with no DST, so the offset arithmetic here and
 * the Intl-based lookup in lib/time.ts always agree.
 */
export const PREPAINT_SCRIPT = `(function(){try{
var s=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
if(s!=="light"&&s!=="dark"){var h=new Date(Date.now()+19800000).getUTCHours();s=(h>=22||h<6)?"dark":"light";}
document.documentElement.dataset.theme=s;
}catch(e){document.documentElement.dataset.theme="dark";}})();`;
