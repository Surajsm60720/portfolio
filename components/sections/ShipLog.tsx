import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { shipLog, shipLogGeneratedOn, shipLogHidden } from "@/lib/ship-log";

export default function ShipLog() {
  const entries = shipLog();
  const hidden = shipLogHidden();

  return (
    <section className="section" id="ship-log" aria-labelledby="ship-log-title">
      <div className="wrap">
        <SectionHeader
          titleId="ship-log-title"
          eyebrow="Ship log"
          title="Releases, not resolutions"
          lede="Most recent first. Releases sync from GitHub each week."
        />

        <ol className="log">
          {entries.map((entry, i) => (
            <Reveal as="li" className="log__row" key={`${entry.date}-${entry.label}`} delay={Math.min(i, 6) * 45}>
              <p className="log__date">{entry.display}</p>
              <div className="log__main">
                <p className="log__label">
                  {entry.href ? (
                    <a className="log__link" href={entry.href} target="_blank" rel="noopener noreferrer">
                      {entry.label}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  ) : (
                    entry.label
                  )}
                </p>
                {entry.detail ? <p className="log__detail">{entry.detail}</p> : null}
              </div>
            </Reveal>
          ))}
        </ol>

        <p className="log__stamp">
          Releases last synced {shipLogGeneratedOn}
          {hidden > 0 ? ` · ${hidden} older entries not shown` : ""}.
        </p>
      </div>
    </section>
  );
}
