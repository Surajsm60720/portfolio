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
  document
    .querySelectorAll<HTMLElement>(".page [data-pick]")
    .forEach((el) => delete el.dataset.pick);
}

/* ---------- the cursor ----------
   With one page on screen at a time, the pad is a menu cursor rather than a
   scrollbar: down walks the links and buttons of the page it is on, and
   steps to the next page when it runs out of them.

   The list is read from the DOM each time the page changes rather than
   declared anywhere, for the same reason the pages themselves are: a new
   project with a new link joins the menu without touching this file. */

/** Everything on the visible page a cursor can land on, in document order. */
export function selectables(): HTMLElement[] {
  const box = document.querySelector<HTMLElement>(".page");
  if (!box) return [];
  return Array.from(
    box.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
  ).filter(
    /* Pages that are not on screen are display:none, so this is also what
       keeps the cursor inside the page you are looking at. */
    (el) => el.getClientRects().length > 0,
  );
}

/**
 * Marks one item as the cursor's, and gives it real focus.
 *
 * Focus rather than a painted marker alone: Enter then activates the item
 * without the pad having to forward it, and a screen reader is told what is
 * selected by the browser rather than by an aria-live message that has to
 * be kept in step with it.
 */
export function paintPick(items: HTMLElement[], index: number): void {
  const box = document.querySelector<HTMLElement>(".page");
  /* Cleared across the whole page, not just this list: the previous page's
     items are display:none rather than gone, and a stale marker on one of
     them would still be there when it came back on screen. */
  box
    ?.querySelectorAll<HTMLElement>("[data-pick]")
    .forEach((el) => delete el.dataset.pick);

  const item = items[index];
  if (!item) {
    if (box?.contains(document.activeElement)) {
      (document.activeElement as HTMLElement).blur();
    }
    return;
  }
  item.dataset.pick = "on";
  item.focus();
}

/** What the HUD calls the selected item. */
export function labelOf(item: HTMLElement | undefined): string {
  if (!item) return "";
  const text = item.getAttribute("aria-label") || item.textContent || "";
  return text.replace(/\s+/g, " ").trim().slice(0, 28);
}
