import generated from "./ship-log.json";
import { shipLogCurated, type ShipEntry } from "./content";

/**
 * Releases come from GitHub weekly; the curated entries cover what GitHub
 * cannot see. They are one list to the reader, so they are merged and sorted
 * together rather than shown as two sections.
 */
export interface DatedEntry extends ShipEntry {
  /** Month and year, or year alone where that is all the source supports. */
  display: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Pads a partial date so entries of differing precision still sort. */
function sortKey(date: string): string {
  const [y, m = "01", d = "01"] = date.split("-");
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function display(date: string): string {
  const [y, m] = date.split("-");
  return m ? `${MONTHS[Number(m) - 1]} ${y}` : y;
}

/**
 * Releases accumulate for as long as the sync runs, so the rendered list is
 * capped. Without this the section grows without bound and eventually reads
 * as a changelog rather than a highlight reel.
 */
export const SHIP_LOG_LIMIT = 12;

export function shipLog(): DatedEntry[] {
  return [...generated.entries, ...shipLogCurated]
    .sort((a, b) => sortKey(b.date).localeCompare(sortKey(a.date)))
    .slice(0, SHIP_LOG_LIMIT)
    .map((entry) => ({ ...entry, display: display(entry.date) }));
}

/** How many entries exist beyond the cap, for the note under the list. */
export function shipLogHidden(): number {
  return Math.max(0, generated.entries.length + shipLogCurated.length - SHIP_LOG_LIMIT);
}

export const shipLogGeneratedOn = generated.generated;
