import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { proof } from "@/lib/content";

export default function Proof() {
  return (
    <section className="section section--panel" id="proof">
      <div className="wrap">
        <SectionHeader eyebrow="Proof" title="On the record" />

        <ul className="proof">
          {proof.map((item, i) => (
            <Reveal as="li" className="proof__row" key={item.title} delay={i * 70}>
              <p className="proof__kind">{item.kind}</p>
              <div>
                <h3 className="proof__title">{item.title}</h3>
                <p className="proof__meta">{item.meta}</p>
                {item.detail ? <p className="proof__detail">{item.detail}</p> : null}
                {item.href ? (
                  <a className="link proof__link" href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.hrefLabel ?? "Link"}
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
