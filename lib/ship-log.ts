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
export const SHIP_LOG_LIMIT = 10;

/** "Saizen v1.4.0" is a release of Saizen; "Saizen site" is not a release. */
const RELEASE = /^(.*?)\s+v\d[\d.]*$/;

/**
 * Keeps the ends of each project's release history and drops the middle.
 *
 * Six Saizen rows — 1.0.0, 1.1.0, 1.2.0, 1.3.0, 1.4.0, 1.4.2 — told the
 * reader one thing six times, and the four in the middle pushed everything
 * else off the list. What is worth reading is where a project started and
 * where it is now; the versions between those are a changelog, and the
 * repository already has one.
 *
 * Filtered here rather than trimmed out of ship-log.json, because the sync
 * rewrites that file from GitHub every week and would put them straight
 * back. Anything without a version — a site, a paper, a job — is never a
 * release and is never dropped.
 */
function majorOnly(entries: ShipEntry[]): ShipEntry[] {
  const releases = new Map<string, ShipEntry[]>();
  for (const entry of entries) {
    const project = RELEASE.exec(entry.label)?.[1];
    if (!project) continue;
    const group = releases.get(project);
    if (group) group.push(entry);
    else releases.set(project, [entry]);
  }

  /* Entries arrive newest first, so the first and last of each group are
     the current release and the one it started from. */
  const keep = new Set<ShipEntry>();
  for (const group of releases.values()) {
    keep.add(group[0]);
    keep.add(group[group.length - 1]);
  }

  return entries.filter((entry) => !RELEASE.test(entry.label) || keep.has(entry));
}

function merged(): ShipEntry[] {
  return majorOnly(
    [...generated.entries, ...shipLogCurated].sort((a, b) =>
      sortKey(b.date).localeCompare(sortKey(a.date)),
    ),
  );
}

export function shipLog(): DatedEntry[] {
  return merged()
    .slice(0, SHIP_LOG_LIMIT)
    .map((entry) => ({ ...entry, display: display(entry.date) }));
}

/**
 * How many entries exist beyond the cap, for the note under the list.
 * Counted against what would have been shown, not against the raw sources —
 * the point releases are not hidden, they are not part of this list.
 */
export function shipLogHidden(): number {
  return Math.max(0, merged().length - SHIP_LOG_LIMIT);
}

export const shipLogGeneratedOn = generated.generated;
