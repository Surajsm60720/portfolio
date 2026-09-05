import { ArrowUpRight, FileText, Mail } from "lucide-react";
import Greeting from "@/components/Greeting";
import Quip from "@/components/Quip";
import { identity, now, socials } from "@/lib/content";
import { shipLog } from "@/lib/ship-log";

export default function Hero() {
  /* The most recent thing shipped, taken from the synced log rather than
     restated by hand — this line was the likeliest on the page to go stale. */
  const latest = shipLog()[0];

  return (
    <section className="hero" aria-labelledby="hero-name">
      <div className="wrap hero__grid">
        <div className="hero__inner">
          {/* Your clock. The rail's clock is his — see components/chrome/TopRail. */}
          <Greeting />

          <p className="eyebrow">{identity.location} · {identity.role}</p>

          <h1 className="hero__name" id="hero-name">{identity.name}</h1>

          {/* The thesis. Everything below this line on the page is evidence for it. */}
          <p className="hero__thesis">{identity.thesis}</p>
          <p className="hero__claim">{identity.thesisNote}</p>

          <Quip />

          <div className="hero__actions">
            <a className="action action--primary" href={`mailto:${identity.email}`}>
              <Mail size={13} aria-hidden="true" />
              {identity.email}
            </a>
            <a className="action" href={identity.resume} target="_blank" rel="noopener noreferrer">
              <FileText size={13} aria-hidden="true" />
              Résumé
            </a>
          </div>

          {/* Print only: the icon links vanish on paper, so the addresses
              behind them are spelled out. Sourced from lib/content.ts. */}
          <p className="hero__print">
            {[identity.email, ...socials.map((s) => s.href.replace(/^https?:\/\//, "").replace(/\/$/, "")), `surajmenon.vercel.app${identity.resume}`].join(" · ")}
          </p>

          <ul className="hero__socials">
            {socials.map((social) => (
              <li key={social.label}>
                <a className="hero__social" href={social.href} target="_blank" rel="noopener noreferrer">
                  {social.label}
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* What is open right now, beside the name rather than under it. */}
        <aside className="hero__now" aria-labelledby="now-title">
          <h2 className="eyebrow" id="now-title">Now</h2>
          <dl className="now">
            {now.map((line) => (
              <div className="now__row" key={line.label}>
                <dt className="now__label">{line.label}</dt>
                <dd className="now__body">
                  <span className="now__value">{line.value}</span>
                  <span className="now__detail">{line.detail}</span>
                </dd>
              </div>
            ))}
            <div className="now__row">
              <dt className="now__label">Last shipped</dt>
              <dd className="now__body">
                <span className="now__value">
                  {latest.href ? (
                    <a className="now__link" href={latest.href} target="_blank" rel="noopener noreferrer">
                      {latest.label}
                      <ArrowUpRight size={11} aria-hidden="true" />
                    </a>
                  ) : (
                    latest.label
                  )}
                </span>
                <span className="now__detail">{latest.display}</span>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
