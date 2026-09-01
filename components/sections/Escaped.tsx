import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { roles } from "@/lib/content";

export default function Escaped() {
  return (
    <section className="section section--panel" id="escaped">
      <div className="wrap">
        <SectionHeader
          eyebrow="Escaped"
          title="Where it was for other people"
          lede="Three internships. The constraint changes; the work does not get easier."
        />

        <ol className="roles">
          {roles.map((role, i) => (
            <Reveal as="li" className="role" key={role.company} delay={i * 70}>
              <div className="role__meta">
                <p className="role__period">{role.period}</p>
                {role.current ? <span className="role__live">Current</span> : null}
              </div>

              <div className="role__main">
                <h3 className="role__title">
                  {role.title}
                  <span className="role__at"> · {role.company}</span>
                </h3>
                <p className="role__body">{role.body}</p>

                <ul className="chips">
                  {role.facts.map((fact) => (
                    <li className="chip chip--fact" key={fact}>
                      {fact}
                    </li>
                  ))}
                </ul>

                <ul className="chips role__stack">
                  {role.stack.map((tech) => (
                    <li className="chip" key={tech}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
