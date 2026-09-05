import { ArrowUpRight, FileText, Mail } from "lucide-react";
import Greeting from "@/components/Greeting";
import Quip from "@/components/Quip";
import DPad from "@/components/DPad";
import { identity, socials } from "@/lib/content";

export default function Hero() {
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

        {/* The empty half, given something to do rather than something to
            look at. See components/DPad.tsx. */}
        <div className="hero__pad">
          <DPad />
          <p className="hero__padHint">
            Four ways down the page. Arrow keys work while it has focus.
          </p>
        </div>
      </div>
    </section>
  );
}
