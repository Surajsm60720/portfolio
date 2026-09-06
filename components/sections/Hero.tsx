import { FileText, Mail } from "lucide-react";
import Greeting from "@/components/Greeting";
import Quip from "@/components/Quip";
import { identity, socials } from "@/lib/content";
import ScrollCues, { DownCue, SkyCue } from "@/components/ScrollCues";

/**
 * Laid out as bands across the full column rather than one narrow stack.
 *
 * Everything used to sit left-aligned at 50-something characters, which left
 * half the page empty and made the hero read as a list. It now reads across:
 * greeting against the role, the name at full width, and the thesis beside
 * the argument for it.
 *
 * The social links used to face the two actions across the foot. They live
 * in the footer now, where the rest of the ways to reach him are; the hero
 * asks for one thing rather than six. They are still spelled out in the
 * print line below, because that is the only copy paper gets.
 */
export default function Hero() {
  return (
    <section className="hero" id="intro" aria-labelledby="hero-name">
      <div className="wrap hero__inner">
        {/* Listens for the page being pulled up past its own top. Renders
            nothing; the two hints below are the visible half. */}
        <ScrollCues />

        <SkyCue />

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
        </div>

        <DownCue />

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
