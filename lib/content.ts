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
  /* The thesis. Everything below is evidence for it.
     An earlier version read "a user base of one, sometimes it escapes",
     which was wrong about the person: it framed shipped apps, a published
     add-on, a paper and three internships as a private hobby. */
  thesis: "I ship what I start.",
  thesisNote:
    "Every one of these began as a problem \u2014 mine, a customer's, or a team's. The good ones stopped being only mine.",
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

/** Day and Night only. "Last shipped" is rendered from the synced ship log —
    see components/sections/Now.tsx — so it must not also be stated here. */
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
  /** ISO, at whatever precision is honest: YYYY, YYYY-MM or YYYY-MM-DD. */
  date: string;
  label: string;
  detail: string;
  href?: string;
}

/**
 * The entries GitHub cannot know about. Releases are generated weekly into
 * lib/ship-log.json by scripts/sync-github.mjs; these are merged with them at
 * render and sorted together.
 *
 * Do not add a release here — it will appear twice. This list is for things
 * that happened off GitHub.
 */
export const shipLogCurated: ShipEntry[] = [
  {
    date: "2026-08-28",
    label: "Saizen site",
    detail: "One-page static site for the app. No animation dependencies.",
    href: "https://saizen.vercel.app",
  },
  {
    /* Saizen's README is explicit that 1.4.1 and 1.4.2 shipped in-app rather
       than as GitHub release IPAs, so the sync cannot see them. */
    date: "2026-08-22",
    label: "Saizen v1.4.2",
    detail:
      "Home personalization reliability and liquid-glass chrome controls. Shipped in-app, not as a GitHub release.",
    href: "https://github.com/Surajsm60720/Saizen",
  },
  {
    date: "2026-08-23",
    label: "LifeOS site",
    detail: "Rebuilt from a single-file prototype onto Next.js.",
    href: "https://lifeossite.vercel.app/",
  },
  {
    date: "2026-08-17",
    label: "LifeOS v1.0.2",
    detail: "Map-first place picker and occurrence-cycle Ongoing Events.",
    href: "https://github.com/Surajsm60720/LifeOS",
  },
  {
    date: "2026-03",
    label: "NanoPrune Canvas",
    detail: "Pruning and quantization simulator with edge-hardware fit analysis.",
    href: "https://github.com/Surajsm60720/nano-prune-canvas",
  },
  {
    date: "2025-09",
    label: "i-made-an-oopsie",
    detail: "A recovery script, written after the fact. Repeatedly.",
    href: "https://github.com/Surajsm60720/i-made-an-oopsie",
  },
  {
    date: "2026-02",
    label: "Started at Plivo",
    detail: "Forward Deployed Engineer Intern.",
  },
  {
    date: "2025-11",
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

/** Where this page itself lives. */
export const site = {
  version: "3.0.0",
  repo: "https://github.com/Surajsm60720/portfolio",
} as const;

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
  "The clock in the corner is his, not yours. The theme follows your system.",
  "Three typefaces, none of them the framework default. That was the entire argument.",
  "Nothing here is a stock photo, on the technicality that nothing here is a photo.",
  "Every claim on this page traces to a r\u00e9sum\u00e9 or a README. Low bar. Most sites trip on it.",
  "The chart further down is real commit data, resynced from GitHub every week.",
  "The complaint comes before the project because that is the order it happened in.",
  "This page prints properly. Genuinely. Try it.",
  "No animation library. The one thing that moves does it with two CSS properties.",
  "The projects below are ordered by what they took, not by when they happened.",
  "The greeting runs on your clock. Everything else on this page runs on his.",
  "The previous version of this page sat unchanged for nine months. Every word now lives in one file so that is harder to repeat.",
  "Yes, the quote shrinking into the margin was deliberate.",
  "You can click this line. That is the whole feature.",
];

/* --------------------------------------------------------- hour notes */

/**
 * What each hour of the visitor's day is generally like. One line is chosen
 * per visit; the pick is stable for as long as the hour and the day are.
 *
 * Three rules govern what may go in here:
 *
 *  1. A note describes the hour, never Suraj. The greeting runs on the
 *     reader's clock, so anything keyed to his data — his peak commit hours,
 *     the chart further down this page — is false for every reader outside
 *     IST.
 *  2. No invented statistics. Where a note asserts something it is something
 *     that holds generally and can be checked: clocks skipping at 2 AM for
 *     daylight saving, the circadian nadir, the cortisol rise after waking,
 *     meridiem giving us AM and PM, melatonin onset in the late evening.
 *  3. **It must be true on the day it appears.** The first version was
 *     hour-only, so a Sunday at 09:00 claimed standup was running long and
 *     markets were opening. Sixteen of ninety-six lines assumed a working
 *     day. Hours where that matters now carry a weekend set, and 17:00
 *     carries a Friday one.
 *
 * Indexed 0-23. Selection is friday, then weekend, then weekday.
 */
const weekday: string[][] = [
  [
    "Midnight. The date changed while you were reading this.",
    "The one hour that belongs to two days at once.",
    "Cinderella's deadline. Everyone else negotiates.",
    "The hour of \u201Cone more thing\u201D, indefinitely.",
  ],
  [
    "The hour of one more episode.",
    "Nothing good has ever been bought at one in the morning.",
    "Too late to start, too early to give up.",
    "The hour tomorrow's problem gets created.",
  ],
  [
    "Nothing written now survives review.",
    "The hour clocks skip in spring and repeat in autumn.",
    "Bars are closing. Somewhere, always.",
    "The last honest hour before the body objects.",
  ],
  [
    "The circadian low \u2014 the body's least favourite hour.",
    "Core body temperature is near its lowest right about now.",
    "The hour that makes every decision look worse than it is.",
    "The devil's hour, if you are superstitious. Just cold, if not.",
  ],
  [
    "Bakers are up. Almost nobody else is.",
    "The hour before the one anyone admits to.",
    "First flights are boarding somewhere unpleasant.",
    "Dawn is closer than it feels.",
  ],
  [
    "Birds first. Everyone else in a bit.",
    "The dawn chorus is peaking, seasonally speaking.",
    "The hour alarms are set for and then renegotiated.",
    "Bread is out of the oven. You are not near it.",
  ],
  [
    "Roughly sunrise, most of the year, most of the world.",
    "The hour of the first honest decision of the day.",
    "Cortisol is climbing whether you asked it to or not.",
    "A gym is unlocking somewhere. A snooze button elsewhere.",
  ],
  [
    "First coffee, last snooze.",
    "The hour of showers and half-formed plans.",
    "Toast is being burnt at scale.",
    "The news is on and nobody is listening yet.",
  ],
  [
    "Commutes, and the quiet resentment of commutes.",
    "The hour of school runs and unread messages.",
    "Peak toast-to-inbox transition.",
    "Trains are full. Patience is not.",
  ],
  [
    "Standup is happening somewhere, and running long.",
    "The hour calendars were invented to ruin.",
    "Inbox zero is briefly plausible.",
    "Markets are opening somewhere, loudly.",
  ],
  [
    "Peak focus, for about forty minutes, before the first meeting.",
    "The hour the second coffee stops helping.",
    "The hour meetings colonised first.",
    "Concentration is real now. Spend it well.",
  ],
  [
    "Too late for breakfast, too early to admit you want lunch.",
    "The hour of pretending you are not hungry.",
    "Elevenses, if you are being honest about it.",
    "The last quiet hour before the afternoon happens.",
  ],
  [
    "Solar noon, give or take how far your timezone is lying.",
    "Midday. The sun is roughly where the clock claims it is.",
    "The hour lunch is decided by whoever speaks first.",
    "Noon \u2014 meridiem, and the reason we say AM and PM.",
  ],
  [
    "The after-lunch dip. It has a real name: postprandial somnolence.",
    "The hour meetings should be illegal.",
    "One o'clock, and the day quietly resets.",
    "Attention is elsewhere, and it is not entirely your fault.",
  ],
  [
    "The afternoon trough. Move the important meeting.",
    "The hour of the third coffee and its diminishing returns.",
    "Nothing decided now will be remembered by five.",
    "Peak hour for staring at a wall productively.",
  ],
  [
    "Chai, in the country this page was written from.",
    "Afternoon tea, wherever that is still observed.",
    "The hour school lets out and traffic notices.",
    "The second wind, if it is coming at all.",
  ],
  [
    "The hour of remembering what you meant to do at ten.",
    "Alertness climbs again around now. Use it.",
    "The hour of \u201Clet us pick this up tomorrow\u201D.",
    "Physical performance peaks in the late afternoon, roughly here.",
  ],
  [
    "Somewhere a deploy is going out this late in the day. Bold.",
    "Five o'clock \u2014 the hour clocks were built to reach.",
    "The hour of the last honest commit.",
    "A standup is being rescheduled to tomorrow as we speak.",
  ],
  [
    "Commutes again, backwards.",
    "The hour of the walk home and the podcast that finishes it.",
    "Golden hour, if the sky is cooperating.",
    "The hour work stops being paid for.",
  ],
  [
    "Dinner, for most of the world that keeps to one.",
    "The hour the day stops asking anything of you.",
    "Kitchens are loud. Inboxes are not.",
    "The hour after which nothing urgent is actually urgent.",
  ],
  [
    "Prime time \u2014 a name broadcast television left behind.",
    "The hour of the good intention and the second episode.",
    "Somewhere a side project is being opened.",
    "The hour the day turns voluntary.",
  ],
  [
    "The hour of one more small fix.",
    "Melatonin is rising. It has opinions about your screen.",
    "The hour tomorrow's plans are made and not kept.",
    "Everything feels tractable now. It will not at eleven.",
  ],
  [
    "The hour of the fix that breaks two other things.",
    "The hour sleep is scheduled, then negotiated.",
    "Ten o'clock. Somewhere the last train is leaving.",
    "The hour good judgement starts filing for leave.",
  ],
  [
    "Late enough that tomorrow is technically the plan.",
    "The hour before the date changes underneath you.",
    "The last hour that still counts as today.",
    "Eleven. Everything after this is borrowed.",
  ],
];
/** Saturday and Sunday, for the hours where the weekday line would be wrong. */
const weekend: Record<number, string[]> = {
  8: [
    "Nobody is commuting anywhere. That is the entire point of today.",
    "The hour a weekday would have started. It did not.",
    "Somewhere a very long breakfast is being assembled.",
  ],
  9: [
    "No standup. Nothing is running long.",
    "The markets are shut and so, mostly, is everyone.",
    "The hour that feels early only because it usually is.",
  ],
  10: [
    "Peak focus, spent on something entirely optional.",
    "The first genuinely unclaimed hour of the week.",
    "No meeting has any right to this one.",
  ],
  13: [
    "Lunch, with nobody waiting on the other side of it.",
    "The after-lunch dip, but nothing is expected of you.",
    "One o'clock, and the day is still mostly ahead.",
  ],
  14: [
    "The afternoon trough, off the clock, which helps.",
    "The hour of the nap that was not planned.",
    "Nothing decided now needs to be decided.",
  ],
  15: [
    "Chai, in the country this page was written from.",
    "No traffic, no school run, no reason to be anywhere.",
    "The hour that goes missing on a good weekend.",
  ],
  17: [
    "No deploy. Nothing is on fire. Probably.",
    "The hour the light starts to go and nobody minds.",
    "Somewhere a side project is getting the good hours for once.",
  ],
  18: [
    "Nobody is commuting home because nobody left.",
    "The hour a weekday would have ended. It did not start.",
    "Golden hour, if the sky is cooperating.",
  ],
  19: [
    "Dinner, taken slowly for once.",
    "The hour the weekend admits it is nearly over.",
    "Kitchens are loud. Nothing else is.",
  ],
};

/** Friday alone — the one line that only makes sense at the end of a week. */
const friday: Record<number, string[]> = {
  17: [
    "Somewhere a deploy is going out before the weekend. Bold.",
    "The hour Friday stops pretending to be a working day.",
    "The last honest commit of the week.",
  ],
};

/** friday, then weekend, then weekday. `day` is 0 (Sunday) to 6. */
export function notesFor(hour: number, day: number): string[] {
  if (day === 5 && friday[hour]) return friday[hour];
  if ((day === 0 || day === 6) && weekend[hour]) return weekend[hour];
  return weekday[hour];
}

