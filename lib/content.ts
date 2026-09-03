/**
 * Single source of truth for every word and number on this site.
 *
 * PRIME DIRECTIVE: every factual claim here traces to either
 *   - ~/codes/Resume/cv.tex (dates, metrics, education, publication), or
 *   - the corresponding repository's own README.md (features, versions).
 *
 * Do not add or reword a claim without re-verifying it against its source.
 * The previous build of this site went nine months stale because copy was
 * scattered across nine components. It lives here now so a release means
 * editing one file.
 */

export const identity = {
  name: "Suraj Menon",
  fullName: "Suraj Sreeprakash Menon",
  /* The thesis. Everything below is evidence for it. */
  thesis: "I build software with a user base of one. Sometimes it escapes.",
  role: "Forward Deployed Engineer at Plivo",
  location: "Bengaluru, IN",
  timezone: "Asia/Kolkata",
  email: "surajsm218@gmail.com",
  resume: "/cv.pdf",
} as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/Surajsm60720" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/surajmenon60720/" },
  { label: "X", href: "https://x.com/surajsm223" },
  { label: "Instagram", href: "https://www.instagram.com/stargazer60720/" },
] as const;

/* ---------------------------------------------------------------- now */

export interface NowLine {
  label: string;
  value: string;
  detail: string;
}

export const now: NowLine[] = [
  {
    label: "Day",
    value: "Forward Deployed Engineer, Plivo",
    detail:
      "Primary technical contact for enterprise customers. Live debugging calls on voice, messaging and console API failures.",
  },
  {
    label: "Night",
    value: "Saizen v1.4.2",
    detail:
      "A personal iOS anime client. Currently reworking Home personalization and the chrome controls.",
  },
  {
    label: "Last shipped",
    value: "saizen.vercel.app",
    detail:
      "One-page site for the app, built the same week. Static export, no animation dependencies.",
  },
];

/* ------------------------------------------------------------ projects */

export interface Project {
  slug: string;
  name: string;
  /** The complaint, first person. This is the signature — see spec §6a. */
  itch: string;
  /** One sentence: what it actually is. */
  what: string;
  /** Two to three sentences of substance. */
  body: string;
  /** Mono chips: versions, counts, measured results. Numbers only, no adjectives. */
  facts: string[];
  stack: string[];
  repo?: string;
  live?: string;
  /** Anything unusual worth a line of its own. */
  note?: string;
  /** Engineering documents written before or alongside the build. */
  docs?: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    slug: "saizen",
    name: "Saizen",
    itch: "Every anime client I tried wanted an account, an ad, or a subscription.",
    what: "A personal iOS anime client that resolves installable stream modules and plays them in a custom native player.",
    body: "Watch installs source modules rather than shipping a fixed scraper, so a broken source is a module update instead of an app release. Playback runs through custom AVPlayer chrome with AniSkip opening and ending marks, gesture seeking and speed control. Downloads hold a resilient queue with pause, resume and offline library playback; AniList and MAL sign-in back the home rails.",
    facts: ["v1.4.2", "Sideload only", "HLS + MP4", "AniList / MAL"],
    stack: ["Next.js", "Capacitor 7", "Swift", "AVPlayer", "TypeScript"],
    repo: "https://github.com/Surajsm60720/Saizen",
    live: "https://saizen.vercel.app",
    docs: [
      {
        label: "Module contract",
        href: "https://github.com/Surajsm60720/Saizen/blob/main/docs/MODULE_CONTRACT.md",
      },
      {
        label: "Security test plan",
        href: "https://github.com/Surajsm60720/Saizen/blob/main/docs/SECURITY_TEST_PLAN.md",
      },
    ],
  },
  {
    slug: "aegisqa",
    name: "AegisQA",
    itch: "Writing test cases out of a spec document is the least interesting part of shipping, and I kept doing it by hand.",
    what: "A test-generation platform that turns requirement documents, UI screenshots and code changes into reviewed test cases.",
    body: "Six specialised LLM roles run as a pipeline rather than one prompt: a classifier routes the input, two roles extract requirements and hunt for ambiguity, two generators split happy-path from negative and edge cases, and a judge scores and repairs the fused output. Uploads, jobs and artifacts move through Kafka and MinIO behind a FastAPI service, with regression cases ingested from n8n workflows.",
    facts: ["6-role pipeline", "Regression ingest", "Job lifecycle tracking"],
    stack: ["FastAPI", "Next.js", "Kafka", "PostgreSQL", "MinIO", "n8n"],
    // No links until the repository is public — see spec §5.2.
  },
  {
    slug: "nammalakes",
    name: "NammaLakes",
    itch: "Nobody notices a lake is dying until it already has.",
    what: "A distributed IoT system monitoring the health of urban lakes in real time.",
    body: "Sensor readings move through RabbitMQ into fault-tolerant FastAPI microservices with structured logging, so a failing node degrades the feed rather than dropping it. An Isolation Forest model flags water-quality anomalies automatically, and the dashboard renders the live series without waiting on a full refresh.",
    facts: ["17,000+ points/day", "3 sensors @ 5s", "Isolation Forest"],
    stack: ["FastAPI", "RabbitMQ", "Vite + React", "Recharts", "PostgreSQL"],
    repo: "https://github.com/NammaLakes",
    live: "https://nammalakes.github.io/",
    note: "Published in IJLTEMAS, 2025.",
  },
  {
    slug: "lifeos",
    name: "LifeOS",
    itch: "I kept missing things I had already told myself I would remember.",
    what: "A calendar-centric iOS app for tracking day-to-day life, game events and entertainment progress — locally, with no accounts.",
    body: "One entry model covers IRL plans, gacha-game cadence and reading logs, with recurrence and occurrence-level completion. A Dynamic Island Live Activity surfaces today at a glance, an Ongoing Events tab holds multi-day windows and the current weekly or monthly cycle, and everything stays on device behind an optional Face ID lock with JSON backup and restore.",
    facts: ["v1.0.2", "Local-first", "Live Activity", "No accounts"],
    stack: ["Swift", "SwiftUI", "WidgetKit", "MapKit"],
    repo: "https://github.com/Surajsm60720/LifeOS",
    live: "https://lifeossite.vercel.app/",
  },
  {
    slug: "nano-prune-canvas",
    name: "NanoPrune Canvas",
    itch: "You cannot tell whether a model fits on the device until after you have already compressed it.",
    what: "A browser toolkit for simulating magnitude pruning and post-training quantization before deploying to edge hardware.",
    body: "Upload a PyTorch or ONNX model and it parses the architecture into an interactive node graph, colour-coding edges by weight magnitude. Pruning threshold and quantization precision update global and per-layer sparsity live, and the hardware panel reports flash and SRAM fit, inference time, energy per inference and battery life across a catalogue of embedded targets.",
    facts: ["26 embedded targets", "FP32 → INT4", "PyTorch + ONNX"],
    stack: ["FastAPI", "Next.js", "React Flow", "Recharts", "PyTorch"],
    repo: "https://github.com/Surajsm60720/nano-prune-canvas",
  },
  {
    slug: "linux-starter-pack",
    name: "Linux Starter Pack",
    itch: "Fresh install, twelfth time, and I am looking up the package manager syntax again.",
    what: "A cross-platform TUI that installs your usual packages on whichever distribution you just landed on.",
    body: "Detects the package manager, resolves dependencies and falls back intelligently when a package is named differently downstream. Mirror latency is checked in parallel so downloads pick a live mirror instead of the default one, and every generated command is reviewable before it runs.",
    facts: ["12 distributions", "60% faster installs", "Parallel mirror checks"],
    stack: ["Python", "Textual", "Next.js", "Tailwind CSS"],
    repo: "https://github.com/Surajsm60720/linux-starter-pack",
    live: "https://linuxstarterpack.vercel.app/",
  },
  {
    slug: "llm-chat-navigator",
    name: "LLM Chat Navigator",
    itch: "The answer was somewhere in this chat, forty messages ago.",
    what: "A browser extension that indexes your own prompts in a long LLM conversation so you can jump straight to one.",
    body: "Builds a searchable index of every message in the thread and scrolls to any of them on click, with live filtering and a running count. Handles platforms that lazy-load older messages as you scroll up, so the index keeps growing instead of silently truncating.",
    facts: ["ChatGPT + Gemini", "Lazy-load aware"],
    stack: ["JavaScript", "WebExtensions API"],
    repo: "https://github.com/Surajsm60720/llm-chat-navigator",
    live: "https://addons.mozilla.org/en-US/firefox/addon/llm-chat-navigator/",
    note: "Published on the Firefox add-ons store.",
  },
];

/* ------------------------------------------------------- experience */

export interface Role {
  company: string;
  title: string;
  period: string;
  current?: boolean;
  body: string;
  facts: string[];
  stack: string[];
}

export const roles: Role[] = [
  {
    company: "Plivo",
    title: "Forward Deployed Engineer Intern",
    period: "Feb 2026 — Present",
    current: true,
    body: "Primary technical point of contact for enterprise customers, spanning API integration, billing, account and legal escalations across engineering and billing teams. Runs live debugging calls diagnosing voice, messaging and console-level API failures, and validates customer use cases against product architecture to assess integration feasibility.",
    facts: ["200+ tickets/month", "Live debugging calls"],
    stack: ["Voice APIs", "Messaging APIs", "Integration support"],
  },
  {
    company: "Jabsz Gaming Studios",
    title: "Full Stack Developer Intern",
    period: "Oct 2025 — Feb 2026",
    body: "Led a full UI/UX redesign of the company website, fixing cross-page issues, adding animations and establishing a consistent visual theme. Migrated the production frontend from React to Next.js App Router, integrating legacy JavaScript and global CSS through custom Next.js configuration and build tooling.",
    facts: ["Lighthouse 50 → 90", "React → Next.js migration"],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "WebP", "SEO"],
  },
  {
    company: "BharatCrest",
    title: "Full Stack Developer Intern",
    period: "Jun 2025 — Aug 2025",
    body: "Built HRMatcher, a recruitment platform automating candidate screening with skill-based filtering and similarity ranking through the Google Gemini API. Also developed a full-stack restaurant management system with real-time order tracking, billing and automated inventory with low-stock alerts.",
    facts: ["100+ resumes in <5 min", "20–30% faster load times"],
    stack: ["React", "FastAPI", "Python", "TypeScript", "Gemini API", "SQLite"],
  },
];

/* --------------------------------------------------------- ship log */

export interface ShipEntry {
  date: string;
  label: string;
  detail: string;
  href?: string;
}

/** Reverse-chronological. Dates from repo history and README release notes. */
export const shipLog: ShipEntry[] = [
  {
    date: "Aug 2026",
    label: "Saizen site",
    detail: "One-page static site for the app. No animation dependencies.",
    href: "https://saizen.vercel.app",
  },
  {
    date: "Aug 2026",
    label: "Saizen v1.4.2",
    detail: "Home personalization reliability and liquid-glass chrome controls.",
    href: "https://github.com/Surajsm60720/Saizen",
  },
  {
    date: "Aug 2026",
    label: "LifeOS site",
    detail: "Rebuilt from a single-file prototype onto Next.js.",
    href: "https://lifeossite.vercel.app/",
  },
  {
    date: "Aug 2026",
    label: "LifeOS v1.0.2",
    detail: "Map-first place picker and occurrence-cycle Ongoing Events.",
    href: "https://github.com/Surajsm60720/LifeOS",
  },
  {
    date: "Mar 2026",
    label: "NanoPrune Canvas",
    detail: "Pruning and quantization simulator with edge-hardware fit analysis.",
    href: "https://github.com/Surajsm60720/nano-prune-canvas",
  },
  {
    date: "Feb 2026",
    label: "Started at Plivo",
    detail: "Forward Deployed Engineer Intern.",
  },
  {
    date: "Nov 2025",
    label: "LLM Chat Navigator",
    detail: "Published on the Firefox add-ons store.",
    href: "https://addons.mozilla.org/en-US/firefox/addon/llm-chat-navigator/",
  },
  {
    date: "2025",
    label: "NammaLakes paper",
    detail: "Published in IJLTEMAS.",
    href: "https://doi.org/10.51583/IJLTEMAS.2025.1409000060",
  },
  {
    date: "Sep 2025",
    label: "i-made-an-oopsie",
    detail: "A recovery script, written after the fact. Repeatedly.",
    href: "https://github.com/Surajsm60720/i-made-an-oopsie",
  },
];

/* ------------------------------------------------------------ proof */

export interface ProofItem {
  kind: string;
  title: string;
  meta: string;
  detail?: string;
  href?: string;
  hrefLabel?: string;
}

export const proof: ProofItem[] = [
  {
    kind: "Publication",
    title:
      "NammaLakes: IoT-Based Real-Time Distributed Lakes Monitoring System",
    meta: "International Journal of Latest Technology in Engineering, Management and Applied Science · 2025",
    detail:
      "A distributed IoT architecture using RabbitMQ and ML-based anomaly detection for real-time water quality monitoring.",
    href: "https://doi.org/10.51583/IJLTEMAS.2025.1409000060",
    hrefLabel: "DOI",
  },
  {
    kind: "Education",
    title: "B.E. Information Science, Dayananda Sagar College of Engineering",
    meta: "VTU · Bengaluru · 2022 — 2026",
    detail: "CGPA 8.9",
  },
  {
    kind: "Certification",
    title: "The Complete Full-Stack Web Development Bootcamp",
    meta: "Udemy · 2025",
    href: "https://www.udemy.com/certificate/UC-3c7703b2-28fe-4ae1-a8ed-1ef0133d89b5/",
    hrefLabel: "Certificate",
  },
];

/* --------------------------------------------------- off the clock */

export interface Aside {
  label: string;
  body: string;
  href?: string;
  hrefLabel?: string;
}

export const offTheClock: Aside[] = [
  {
    label: "Linux",
    body: "“I am prone to making my Linux system go down the drains by doing things I clearly shouldn’t.” So there is a script that puts it all back. It has been used more than once.",
    href: "https://github.com/Surajsm60720/i-made-an-oopsie",
    hrefLabel: "i-made-an-oopsie",
  },
  {
    label: "Gacha",
    body: "Genshin, Star Rail and Wuthering Waves have dailies, banners and patch cycles that do not care about your calendar. That cadence is a first-class entry type in LifeOS, which is the most honest thing on this page.",
  },
  {
    label: "Anime",
    body: "Enough of it that building a client was easier than tolerating the ones that exist. Saizen has watch-order relations because franchise order is genuinely hard to get right.",
  },
  {
    label: "Music",
    body: "Permanently mid-search for the next track. Two forked music players in the repo list are evidence of a problem, not a solution.",
  },
];

/* ----------------------------------------------------- stack ledger */

export interface LedgerRow {
  name: string;
  usedIn: string;
}

export interface LedgerGroup {
  label: string;
  rows: LedgerRow[];
}

/** Every row names where it was actually used. A skill with no project is not a skill. */
export const ledger: LedgerGroup[] = [
  {
    label: "Languages",
    rows: [
      { name: "TypeScript", usedIn: "Saizen · NanoPrune · this site" },
      { name: "Python", usedIn: "AegisQA · NammaLakes · Linux Starter Pack" },
      { name: "Swift", usedIn: "Saizen · LifeOS" },
      { name: "SQL", usedIn: "AegisQA · NammaLakes · HRMatcher" },
      { name: "Bash", usedIn: "i-made-an-oopsie" },
    ],
  },
  {
    label: "Frontend",
    rows: [
      { name: "Next.js", usedIn: "Saizen · LifeOS site · Jabsz migration" },
      { name: "React", usedIn: "NammaLakes · TravelEase · HRMatcher" },
      { name: "SwiftUI", usedIn: "LifeOS" },
      { name: "Tailwind CSS", usedIn: "Linux Starter Pack · TravelEase" },
      { name: "Recharts", usedIn: "NammaLakes · NanoPrune" },
    ],
  },
  {
    label: "Backend",
    rows: [
      { name: "FastAPI", usedIn: "AegisQA · NammaLakes · NanoPrune" },
      { name: "Node.js", usedIn: "TravelEase" },
      { name: "RabbitMQ", usedIn: "NammaLakes" },
      { name: "Kafka", usedIn: "AegisQA" },
    ],
  },
  {
    label: "Data & cloud",
    rows: [
      { name: "PostgreSQL", usedIn: "AegisQA · NammaLakes" },
      { name: "Supabase", usedIn: "TravelEase" },
      { name: "MinIO", usedIn: "AegisQA" },
      { name: "Vercel", usedIn: "Everything with a live link" },
    ],
  },
  {
    label: "Tooling",
    rows: [
      { name: "Docker", usedIn: "AegisQA · NammaLakes" },
      { name: "GitHub Actions", usedIn: "Saizen · LifeOS" },
      { name: "n8n", usedIn: "AegisQA regression ingest" },
      { name: "Capacitor", usedIn: "Saizen" },
    ],
  },
];

/* ------------------------------------------------------- the site itself */

/**
 * The site is versioned the way the apps are, and the changelog is dated.
 * That is partly habit and partly a tripwire: a visible date makes a stale
 * site obvious instead of invisible, which is how the last one rotted for
 * nine months without anyone noticing.
 *
 * Versions reconstructed from this repository's own history.
 */
export const site = {
  version: "3.0.0",
  repo: "https://github.com/Surajsm60720/portfolio",
  spec: "https://github.com/Surajsm60720/portfolio/blob/main/docs/superpowers/specs/2026-09-01-portfolio-redesign-design.md",
} as const;

export interface Release {
  version: string;
  date: string;
  body: string;
}

export const changelog: Release[] = [
  {
    version: "3.0.0",
    date: "2026-09-01",
    body: "Rebuilt around a single thesis. Complaint-first project cards, a clock that reports Bengaluru time and picks the theme from it, and every word moved into one content file. Dropped three.js, GSAP and the animation library; added nothing.",
  },
  {
    version: "2.0.0",
    date: "2025-12-08",
    body: "Sidebar layout with an orbiting skill graph, magnetic hover and a mouse-follower background. Looked expensive, said very little, and then sat unchanged for nine months.",
  },
  {
    version: "1.0.0",
    date: "2025-09-07",
    body: "First real version, after the scaffold. Structure over style.",
  },
];

/* ----------------------------------------------------------- colophon */

export interface ColophonNote {
  label: string;
  body: string;
}

/**
 * Every project above started as a document. So did this page — the notes
 * below are the short version, and the links are the long one.
 */
export const colophon: ColophonNote[] = [
  {
    label: "Temperature",
    body: "The two themes invert colour temperature, because that is what a real screen does at 2 AM. Cool fountain-pen blue on warm paper by day; warm amber on cold black at night.",
  },
  {
    label: "Clock",
    body: "The theme is picked by the time in Bengaluru, not yours. Night runs 19:00 to 06:00 IST, which is where the commit data below actually clusters — not the 22:00 the previous version guessed at.",
  },
  {
    label: "Restraint",
    body: "Two signature interactions and no more: the complaint contracting into the margin, and the warm sweep across a theme change. Everything else is a scroll reveal and a two-pixel hover lift.",
  },
  {
    label: "Type",
    body: "Instrument Serif for display, Karla for prose, JetBrains Mono for anything that is really a label. Three roles, no framework defaults.",
  },
  {
    label: "Budget",
    body: "No 3D, no animation library, no component library, no new runtime dependency. Ideas borrowed from elsewhere are ported by hand into the token file. The numbers below are read out of your browser, not quoted from a build log.",
  },
  {
    label: "Paper",
    body: "This page prints. Cmd-P or Ctrl-P gives a typeset document on white — no dark background, no navigation, no decoration — with the résumé PDF linked at the top for the version with the margins already argued about.",
  },
];

export const designDocs = [
  {
    label: "This site",
    href: site.spec,
  },
  {
    label: "Saizen site",
    href: "https://github.com/Surajsm60720/Saizen-website/blob/master/saizen-site-DESIGN.md",
  },
  {
    label: "LifeOS site",
    href: "https://github.com/Surajsm60720/LifeOS-website/blob/main/docs/superpowers/specs/2026-08-20-lifeos-website-nextjs-migration-design.md",
  },
];

/* -------------------------------------------------------------- quips */

/**
 * The line under the thesis, picked at random per visit and cycled on click.
 *
 * Every one of these is checkable against the page it sits on — the prime
 * directive at the top of this file does not get a comedy exemption. A quip
 * that invents a fact would be the one lie on a page whose whole argument is
 * that it does not have any.
 */
export const quips: string[] = [
  "This section is called \u201Chero\u201D. Every portfolio has one. Sorry.",
  "There is a bar chart further down that proves he mostly works at 20:00.",
  "The theme you are looking at was chosen by a clock in Bengaluru, not by you.",
  "Three typefaces, none of them the framework default. That was the entire argument.",
  "Nothing here is a stock photo, on the technicality that nothing here is a photo.",
  "Every claim on this page traces to a r\u00e9sum\u00e9 or a README. Low bar. Most sites trip on it.",
  "Scroll far enough and the page tells you what it cost your browser to load it.",
  "The complaint comes before the project because that is the order it happened in.",
  "This page prints properly. Genuinely. Try it.",
  "No animation library. The one thing that moves does it with two CSS properties.",
  "He builds software with a user base of one. You are reading its marketing site.",
  "If this is dark right now, it is late where he is \u2014 not necessarily where you are.",
  "The previous version of this page sat unchanged for nine months. The changelog admits it.",
  "Yes, the quote shrinking into the margin was deliberate.",
  "You can click this line. That is the whole feature.",
];
