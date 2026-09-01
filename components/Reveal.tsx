"use client";

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from "react";

type Tag = "div" | "li" | "section" | "article";

/**
 * The only ambient motion on the page: opacity plus a 12px rise, once,
 * then the element is unobserved. No parallax, no scroll-linked work.
 * Under prefers-reduced-motion the CSS resolves `.reveal` immediately, so
 * this still renders — it just never animates.
 */
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: Tag;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.unobserve(entry.target);
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* The intrinsic tags above all accept the same HTML attributes; the cast
     collapses their otherwise-incompatible ref types into one. React 19
     takes ref as an ordinary prop, so this is accurate, not a workaround. */
  const Element = as as unknown as (
    props: HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> },
  ) => ReactNode;

  return (
    <Element
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-shown={shown}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Element>
  );
}
