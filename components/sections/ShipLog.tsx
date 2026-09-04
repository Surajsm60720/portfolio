import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { shipLog } from "@/lib/content";

export default function ShipLog() {
  return (
    <section className="section" id="ship-log" aria-labelledby="ship-log-title">
      <div className="wrap">
        <SectionHeader
          titleId="ship-log-title"
          eyebrow="Ship log"
          title="Releases, not resolutions"
          lede="Most recent first."
        />

        <ol className="log">
          {shipLog.map((entry, i) => (
            <Reveal as="li" className="log__row" key={`${entry.date}-${entry.label}`} delay={Math.min(i, 6) * 45}>
              <p className="log__date">{entry.date}</p>
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
                <p className="log__detail">{entry.detail}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
