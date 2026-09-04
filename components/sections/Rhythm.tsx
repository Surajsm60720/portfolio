import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import data from "@/lib/commit-hours.json";
import { NIGHT_FROM, NIGHT_UNTIL } from "@/lib/time";

/**
 * The evidence for the clock in the top rail.
 *
 * A portfolio claiming "night owl" is a vibe. This is the actual hour-of-day
 * distribution of 179 commits, and the hours tinted in accent are exactly the
 * ones that make this page go dark — so the mechanic is checkable rather than
 * asserted. Snapshot is committed; see scripts/commit-hours.mjs.
 */
export default function Rhythm() {
  const { hours, total, repos, generated } = data;
  const peak = Math.max(...hours);
  const isNightHour = (h: number) => h >= NIGHT_FROM || h < NIGHT_UNTIL;

  return (
    <section className="section" id="rhythm" aria-labelledby="rhythm-title">
      <div className="wrap">
        <SectionHeader
          titleId="rhythm-title"
          eyebrow="Rhythm"
          title="When the work actually happens"
          lede="Two peaks, not one: before the day starts and after it ends. The tinted hours are the ones that switch this page to its night palette — the mechanic reads off this chart, not off a mood."
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
                  {String(hour).padStart(2, "0")}:00 — {count}{" "}
                  {count === 1 ? "commit" : "commits"}
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
            snapshot {generated}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
