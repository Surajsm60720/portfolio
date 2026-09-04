import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import data from "@/lib/commit-hours.json";
import { NIGHT_FROM, NIGHT_UNTIL } from "@/lib/time";

const hh = (h: number) => `${String(h).padStart(2, "0")}:00`;

/**
 * The lede is composed from the data, never asserted over it.
 *
 * This section used to open with "Two peaks, not one: before the day starts
 * and after it ends" — a hand-written reading of a snapshot. Once the numbers
 * started syncing weekly that sentence became a claim nobody was checking,
 * and the first drift would have made it the only false statement on a page
 * whose whole argument is that it has none. It is now derived, so it cannot
 * disagree with the chart beneath it.
 */
function lede(peaks: number[]): string {
  const shape =
    peaks.length === 2 && peaks[0] < 12 && peaks[1] >= 17
      ? `Two peaks, not one — ${hh(peaks[0])} and ${hh(peaks[1])}: before the day starts and after it ends.`
      : peaks.length === 2
        ? `Busiest at ${hh(peaks[0])} and ${hh(peaks[1])}.`
        : `Busiest around ${hh(peaks[0] ?? 0)}.`;
  return `${shape} The tinted hours are the ones that switch this page to its night palette — the mechanic reads off this chart, not off a mood.`;
}

/**
 * The evidence for the clock in the top rail.
 *
 * A portfolio claiming "night owl" is a vibe. This is the actual hour-of-day
 * distribution of real commits, and the hours tinted in accent are exactly
 * the ones that make this page go dark — so the mechanic is checkable rather
 * than asserted. Regenerated weekly; see scripts/sync-github.mjs.
 */
export default function Rhythm() {
  const { hours, total, repos, generated, peaks } = data;
  const peak = Math.max(...hours);
  const isNightHour = (h: number) => h >= NIGHT_FROM || h < NIGHT_UNTIL;

  return (
    <section className="section" id="rhythm" aria-labelledby="rhythm-title">
      <div className="wrap">
        <SectionHeader
          titleId="rhythm-title"
          eyebrow="Rhythm"
          title="When the work actually happens"
          lede={lede(peaks)}
        />

        <Reveal className="rhythm">
          <ol className="rhythm__bars">
            {hours.map((count, hour) => (
              <li
                className="rhythm__bar"
                key={hour}
                data-night={isNightHour(hour)}
                style={{ "--h": `${(count / peak) * 100}%` } as React.CSSProperties}
              >
                <span className="rhythm__fill" />
                <span className="rhythm__sr">
                  {hh(hour)} — {count} {count === 1 ? "commit" : "commits"}
                </span>
              </li>
            ))}
          </ol>

          <div className="rhythm__axis" aria-hidden="true">
            <span>00</span>
            <span>06</span>
            <span>12</span>
            <span>18</span>
            <span>23</span>
          </div>

          <p className="rhythm__meta">
            {total} commits · {repos.length} repositories · merges excluded ·
            synced {generated}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
