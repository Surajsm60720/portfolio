import { ArrowUpRight } from "lucide-react";
import PageCost from "@/components/PageCost";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import { changelog, colophon, designDocs, site } from "@/lib/content";

/**
 * Every project on this page started as a document. So did the page. This
 * section is that habit made visible, plus a dated changelog — which is also
 * a tripwire, since a visible date makes a stale site obvious.
 */
export default function Colophon() {
  return (
    <section className="section section--panel" id="colophon">
      <div className="wrap">
        <SectionHeader
          eyebrow="Colophon"
          title={`This page, v${site.version}`}
          lede="Every project above started as a document. So did this."
        />

        <div className="colo">
          <div className="colo__notes">
            {colophon.map((note, i) => (
              <Reveal className="colo__note" key={note.label} delay={i * 50}>
                <h3 className="colo__label">{note.label}</h3>
                <p className="colo__body">{note.body}</p>
                {note.label === "Budget" ? <PageCost /> : null}
              </Reveal>
            ))}

            <Reveal className="colo__note" delay={colophon.length * 50}>
              <h3 className="colo__label">Documents</h3>
              <ul className="colo__docs">
                {designDocs.map((doc) => (
                  <li key={doc.label}>
                    <a className="link colo__doc" href={doc.href} target="_blank" rel="noopener noreferrer">
                      {doc.label}
                      <ArrowUpRight size={12} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="colo__log">
            <h3 className="colo__label">Changelog</h3>
            <ol className="colo__releases">
              {changelog.map((release) => (
                <li className="colo__release" key={release.version}>
                  <p className="colo__version">
                    <span>v{release.version}</span>
                    <time dateTime={release.date}>{release.date}</time>
                  </p>
                  <p className="colo__body">{release.body}</p>
                </li>
              ))}
            </ol>
            <a className="link colo__doc" href={site.repo} target="_blank" rel="noopener noreferrer">
              Source
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
