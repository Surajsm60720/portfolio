"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/lib/content";
import { register, unregister, type Driven } from "@/lib/scroll-driver";

/**
 * The signature interaction (spec §6a).
 *
 * A project enters as its complaint alone on the ground, in display italic.
 * Scrolling contracts the complaint into the left margin rail as a mono note
 * while the build crossfades into the space it was holding.
 *
 * Progressive enhancement: with no JS, or under prefers-reduced-motion, the
 * card renders with everything visible and legible and nothing moves. The
 * choreography is added by setting data-driven, never assumed.
 */
export default function ItchCard({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target: Driven = {
      el,
      apply: (p) => {
        el.style.setProperty("--p", p.toFixed(3));
        /* data-driven is set by the first real progress value, never at
           mount. If the driver never runs the card simply stays fully
           visible, instead of being stranded at opacity 0. */
        el.dataset.driven = "true";
        /* Once the build has taken over, the quote stops intercepting
           clicks. Before that it is ordinary selectable text. */
        el.dataset.past = p > 0.55 ? "true" : "false";
      },
    };

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? register(target) : unregister(target)),
      { rootMargin: "25% 0px 25% 0px" },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      unregister(target);
      delete el.dataset.driven;
      delete el.dataset.past;
    };
  }, []);

  return (
    <article className="itch" ref={ref} aria-labelledby={`${project.slug}-name`}>
      <div className="itch__rail">
        {/* The complaint after it retires into the margin. Duplicate of the
            hero text, hidden from the accessibility tree so it is announced
            once, not twice. */}
        <p className="itch__note" aria-hidden="true">
          {project.itch}
        </p>
      </div>

      <div className="itch__stage">
        <blockquote className="itch__hero">{project.itch}</blockquote>

        <div className="itch__build">
          <header className="itch__head">
            <h3 className="itch__name" id={`${project.slug}-name`}>
              {project.name}
            </h3>
            <p className="itch__what">{project.what}</p>
          </header>

          <p className="itch__body">{project.body}</p>

          {project.note ? <p className="itch__flag">{project.note}</p> : null}

          <ul className="chips">
            {project.facts.map((fact) => (
              <li className="chip chip--fact" key={fact}>
                {fact}
              </li>
            ))}
          </ul>

          <ul className="chips itch__stack">
            {project.stack.map((tech) => (
              <li className="chip" key={tech}>
                {tech}
              </li>
            ))}
          </ul>

          {project.docs ? (
            <p className="itch__docs">
              <span className="itch__docsLabel">Written first</span>
              {project.docs.map((doc) => (
                <a
                  className="itch__doc"
                  key={doc.label}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.label}
                </a>
              ))}
            </p>
          ) : null}

          {project.repo || project.live ? (
            <div className="itch__links">
              {project.repo ? (
                <a className="action" href={project.repo} target="_blank" rel="noopener noreferrer">
                  <Github size={13} aria-hidden="true" />
                  Source
                </a>
              ) : null}
              {project.live ? (
                <a className="action" href={project.live} target="_blank" rel="noopener noreferrer">
                  <ArrowUpRight size={13} aria-hidden="true" />
                  Live
                </a>
              ) : null}
            </div>
          ) : (
            <p className="itch__private">Repository not public yet.</p>
          )}
        </div>
      </div>
    </article>
  );
}
