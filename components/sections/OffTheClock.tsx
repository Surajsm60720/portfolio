import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { offTheClock } from "@/lib/content";

export default function OffTheClock() {
  return (
    <section className="section" id="off-the-clock">
      <div className="wrap">
        <SectionHeader
          eyebrow="Off the clock"
          title="The rest of the input"
          lede="Half the projects above trace back to something in here."
        />

        <ul className="asides">
          {offTheClock.map((aside, i) => (
            <Reveal as="li" className="aside" key={aside.label} delay={i * 60}>
              <p className="aside__label">{aside.label}</p>
              <p className="aside__body">{aside.body}</p>
              {aside.href ? (
                <a className="link aside__link" href={aside.href} target="_blank" rel="noopener noreferrer">
                  {aside.hrefLabel ?? "Link"}
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              ) : null}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
