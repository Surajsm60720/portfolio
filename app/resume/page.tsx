"use client";

import { useEffect } from "react";
import { identity } from "@/lib/content";

/** /resume is a convenience alias for the PDF. Kept from the previous build. */
export default function ResumePage() {
  useEffect(() => {
    window.location.href = identity.resume;
  }, []);

  return (
    <main className="redirect">
      <p className="eyebrow">Opening résumé</p>
      <a className="link redirect__fallback" href={identity.resume}>
        {identity.resume}
      </a>
    </main>
  );
}
