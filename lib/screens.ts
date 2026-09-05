/**
 * Console mode as a menu rather than a scroll.
 *
 * The screen shows exactly one page at a time and the pad moves between
 * them. Pages are derived from the DOM rather than declared anywhere, so
 * adding a project or a role adds a page without touching this file.
 *
 * A section with repeating items is split; one with a single block is a page
 * on its own. The chunk sizes are per item type rather than measured,
 * because measuring "does this fit" depends on fonts having loaded, the
 * viewport, and the theme, and getting it wrong silently clips content.
 * Fixed sizes are wrong in a way you can see and fix.
 */
const CHUNKS: [selector: string, perPage: number][] = [
  [".itch", 1],
  [".role", 1],
  [".proof__row", 2],
  [".ledger__group", 2],
  [".log__row", 6],
];

export interface Screen {
  /** The section this page belongs to; its heading and HUD name. */
  section: HTMLElement;
  /** The items to show. Empty means the whole section. */
  items: HTMLElement[];
}

export function buildScreens(): Screen[] {
  const out: Screen[] = [];
  const sections = document.querySelectorAll<HTMLElement>(
    ".page section[id], .page footer[id]",
  );

  for (const section of sections) {
    const match = CHUNKS.find(([sel]) => section.querySelector(`:scope ${sel}`));
    if (!match) {
      out.push({ section, items: [] });
      continue;
    }
    const [selector, per] = match;
    const items = Array.from(section.querySelectorAll<HTMLElement>(`:scope ${selector}`));
    for (let i = 0; i < items.length; i += per) {
      out.push({ section, items: items.slice(i, i + per) });
    }
  }
  return out;
}

/** Marks everything off except the page at `index`. */
export function showScreen(screens: Screen[], index: number): void {
  const active = screens[index];
  if (!active) return;

  const shown = new Set(active.items);
  const sections = new Set(screens.map((s) => s.section));

  for (const section of sections) {
    section.dataset.screen = section === active.section ? "on" : "off";
  }

  for (const screen of screens) {
    for (const item of screen.items) {
      item.dataset.screen = shown.has(item) ? "on" : "off";
    }
  }

  /* A new page always starts at its own top; the screen never inherits how
     far down the previous one had been pushed. */
  const box = document.querySelector<HTMLElement>(".page");
  if (box) box.scrollTop = 0;
}

/** Clears every marker, for leaving console mode. */
export function clearScreens(screens: Screen[]): void {
  for (const screen of screens) {
    delete screen.section.dataset.screen;
    for (const item of screen.items) delete item.dataset.screen;
  }
}

/** The first page belonging to the section after (or before) this one. */
export function stepSection(screens: Screen[], index: number, dir: 1 | -1): number {
  const from = screens[index]?.section;
  if (!from) return index;
  if (dir === 1) {
    for (let i = index + 1; i < screens.length; i += 1) {
      if (screens[i].section !== from) return i;
    }
    return screens.length - 1;
  }
  let firstOfCurrent = index;
  while (firstOfCurrent > 0 && screens[firstOfCurrent - 1].section === from) {
    firstOfCurrent -= 1;
  }
  if (firstOfCurrent === 0) return 0;
  const previous = screens[firstOfCurrent - 1].section;
  let i = firstOfCurrent - 1;
  while (i > 0 && screens[i - 1].section === previous) i -= 1;
  return i;
}
