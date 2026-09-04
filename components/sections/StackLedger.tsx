import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { ledger } from "@/lib/content";

export default function StackLedger() {
  return (
    <section className="section section--panel" id="stack" aria-labelledby="stack-title">
      <div className="wrap">
        <SectionHeader
          titleId="stack-title"
          eyebrow="Stack"
          title="Each one, and where it was used"
          lede="A tool with no project next to it is not a tool I know."
        />

        <div className="ledger">
          {ledger.map((group, i) => (
            <Reveal className="ledger__group" key={group.label} delay={i * 55}>
              <h3 className="ledger__label">{group.label}</h3>
              <dl className="ledger__rows">
                {group.rows.map((row) => (
                  <div className="ledger__row" key={row.name}>
                    <dt className="ledger__name">{row.name}</dt>
                    <dd className="ledger__used">{row.usedIn}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
