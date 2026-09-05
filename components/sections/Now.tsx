import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { now } from "@/lib/content";
import { shipLog } from "@/lib/ship-log";

export default function Now() {
  /* The most recent thing shipped, taken from the synced log rather than
     restated by hand — this line was the likeliest on the page to go stale. */
  const latest = shipLog()[0];

  return (
    <section className="section section--panel" id="now" aria-labelledby="now-title">
      <div className="wrap">
        <SectionHeader
          titleId="now-title"
          eyebrow="Now"
          title="What is actually open right now"
          lede="Kept short on purpose. If this is stale, so is everything under it."
        />

        <ul className="now">
          {now.map((line, i) => (
            <Reveal as="li" className="now__row" key={line.label} delay={i * 70}>
              <p className="now__label">{line.label}</p>
              <div>
                <p className="now__value">{line.value}</p>
                <p className="now__detail">{line.detail}</p>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" className="now__row" delay={now.length * 70}>
            <p className="now__label">Last shipped</p>
            <div>
              <p className="now__value">{latest.label}</p>
              <p className="now__detail">
                {latest.detail || `Released ${latest.display}.`}
              </p>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
