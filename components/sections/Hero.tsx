import { ArrowUpRight, FileText, Mail } from "lucide-react";
import { identity, socials } from "@/lib/content";

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero__inner">
        <p className="eyebrow">{identity.location} · {identity.role}</p>

        <h1 className="hero__name">{identity.name}</h1>

        {/* The thesis. Everything below this line on the page is evidence for it. */}
        <p className="hero__thesis">{identity.thesis}</p>

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
    </section>
  );
}
