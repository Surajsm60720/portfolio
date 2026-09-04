import { ArrowUpRight } from "lucide-react";
import PageCost from "@/components/PageCost";
import { identity, site, socials } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="section foot" id="contact">
      <div className="wrap">
        <p className="eyebrow">Contact</p>

        <p className="foot__pitch">
          If you have a problem worth building something for, I would like to hear it.
        </p>

        <a className="foot__mail link" href={`mailto:${identity.email}`}>
          {identity.email}
        </a>

        <ul className="foot__links">
          {socials.map((social) => (
            <li key={social.label}>
              <a className="foot__link" href={social.href} target="_blank" rel="noopener noreferrer">
                {social.label}
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </li>
          ))}
          <li>
            <a className="foot__link" href={identity.resume} target="_blank" rel="noopener noreferrer">
              Résumé
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a className="foot__link" href={site.repo} target="_blank" rel="noopener noreferrer">
              This site
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </li>
        </ul>

        {/* What this page actually cost to load, measured in your browser
            rather than quoted from a build log. */}
        <PageCost />

        <p className="foot__fine">
          © {new Date().getFullYear()} {identity.fullName}. Built in Next.js, no
          animation libraries, no 3D. Every claim on this page traces to the
          résumé or a repository README.
        </p>
      </div>
    </footer>
  );
}
