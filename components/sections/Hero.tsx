import { ArrowUpRight, FileText, Mail } from "lucide-react";
import Greeting from "@/components/Greeting";
import Quip from "@/components/Quip";
import { identity, socials } from "@/lib/content";

/**
 * Laid out as bands across the full column rather than one narrow stack.
 *
 * Everything used to sit left-aligned at 50-something characters, which left
 * half the page empty and made the hero read as a list. It now reads across:
 * greeting against the role, the name at full width, the thesis beside the
 * argument for it, and the two sets of links facing each other.
 */
export default function Hero() {
  return (
    <section className="hero" id="intro" aria-labelledby="hero-name">
      <div className="wrap hero__inner">
        <div className="hero__top">
          {/* Your clock. The rail's clock is his — see components/chrome/TopRail. */}
          <Greeting />
          <p className="eyebrow hero__where">
            {identity.location} · {identity.role}
          </p>
        </div>

        <h1 className="hero__name" id="hero-name">
          <span>{identity.name}</span>
        </h1>

        <div className="hero__body">
          {/* The thesis. Everything below this line on the page is evidence for it. */}
          <p className="hero__thesis">{identity.thesis}</p>

          <div className="hero__aside">
            <p className="hero__claim">{identity.thesisNote}</p>
            <Quip />
          </div>
        </div>

        <div className="hero__foot">
          <div className="hero__actions">
            <a className="action action--primary" href={`mailto:${identity.email}`}>
              <Mail size={13} aria-hidden="true" />
              {identity.email}
            </a>
            <a
              className="action"
              href={identity.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText size={13} aria-hidden="true" />
              Résumé
            </a>
          </div>

          <ul className="hero__socials">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  className="hero__social"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Print only: the icon links vanish on paper, so the addresses
            behind them are spelled out. Sourced from lib/content.ts. */}
        <p className="hero__print">
          {[
            identity.email,
            ...socials.map((s) => s.href.replace(/^https?:\/\//, "").replace(/\/$/, "")),
            `surajmenon.vercel.app${identity.resume}`,
          ].join(" · ")}
        </p>
      </div>
    </section>
  );
}
