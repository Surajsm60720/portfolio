import { ArrowUpRight } from "lucide-react";
import ConsoleLink from "@/components/ConsoleLink";
import { identity, site, socials } from "@/lib/content";

const links = [
  ...socials,
  { label: "Résumé", href: identity.resume },
  { label: "This site", href: site.repo },
];

/**
 * Two columns rather than a stack. The pitch and the address are the only
 * things a reader is here for; the links are a rail beside them, not another
 * block underneath. Previously six stacked blocks ran the footer to roughly
 * the height of a section.
 */
export default function Footer() {
  return (
    <footer className="section foot" id="contact">
      <div className="wrap foot__grid">
        <div>
          <p className="eyebrow">Contact</p>
          <p className="foot__pitch">
            If you have a problem worth building something for, I would like to
            hear it.
          </p>
          <a className="foot__mail link" href={`mailto:${identity.email}`}>
            {identity.email}
          </a>
        </div>

        <ul className="foot__links">
          {links.map((link) => (
            <li key={link.label}>
              <a
                className="foot__link"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="wrap foot__fine">
        © {new Date().getFullYear()} {identity.fullName}. Every claim on this
        page traces to the résumé or a repository README. <ConsoleLink />
      </p>
    </footer>
  );
}
