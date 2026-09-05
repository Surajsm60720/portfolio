# Portfolio Redesign — "Built for one user"

**Version:** 1.0 · Source of truth for visual and content decisions
**Date:** 2026-09-01
**Status:** implemented on branch `UI-overhaul`.

---

## 0. Prime directives (non-negotiable)

- **Every factual claim traces to a source.** Metrics and dates come from `~/codes/Resume/cv.tex`; project descriptions come from the corresponding repo `README.md`. Do not add or reword a claim without re-verifying it against its source.
- **All copy lives in `lib/content.ts`.** No prose hardcoded in a component. This is the structural fix for the site going nine months stale — updating after a release must mean editing one file.
- **Two signature interactions, then stop.** The itch resolve and the Bengaluru clock. Everything else stays disciplined so those two land. Adding a third is a request to remove one of the first two.
- **`prefers-reduced-motion` is honored by every motion system**, including both signatures. The site must be fully comprehensible with motion off.
- **No WebGL, no 3D.** Explicitly out of scope, matching the Saizen site's own budget. A portfolio has no literal object to render.
- **Port, do not install.** Ideas from React Bits / 21st / lightswind are hand-written into the token system. No new runtime dependencies.

---

## 1. What this site is

A single-page portfolio for Suraj Sreeprakash Menon — Forward Deployed Engineer at Plivo, final-year Information Science student at DSCE, and the author of two shipped iOS apps, a published IoT paper, and a Firefox add-on.

**Audience:** engineering hiring managers and recruiters who will spend under a minute on the page, plus engineers who arrive from a repo link and will read everything.

**The page's single job:** make it obvious within ten seconds that this person builds things constantly, for himself, and finishes them.

**Tone:** plain and specific. Numbers instead of adjectives. The honesty about building personal software *is* the credibility.

### 1.1 Thesis

> **I ship what I start.**
> Every one of these began as a problem — mine, a customer's, or a team's.
> The good ones stopped being only mine.

This is not a slogan bolted onto a generic layout — it is an observed fact about the work. `i-made-an-oopsie` exists because he keeps breaking his own Linux install. `linux-starter-pack` exists because he then has to reinstall everything. `llm-chat-navigator` exists because he got tired of scrolling ChatGPT. `LifeOS` exists so he stops forgetting things. `Saizen` is explicitly a "personal iOS anime client" with no App Store CTA. `CIEMarksCalculator` computes his own college marks.

Every project section therefore leads with **the problem, in his voice**, before it shows the artifact.

### 1.2 What is wrong with the current site

| Problem | Evidence |
|---|---|
| Nine months stale | Live site shows Jabsz as "Present"; Jabsz ended Feb 2026 and the Plivo role has never appeared |
| Broken contact | `components/footer.tsx` mailto is `surajmenon@example.com` |
| Wrong social link | `components/hero_section.tsx` LinkedIn points at `suraj-menon-a581ab305`; the real one is `surajmenon60720` |
| No credibility section | The IJLTEMAS publication, the DOI, education, and the certification appear nowhere |
| Weakest work on display | Site shows TravelEase, Linux Starter Pack, NammaLakes. Saizen, AegisQA, LifeOS, nano-prune-canvas, and a published Firefox add-on are all absent |
| Anonymous design | It is the Brittany Chiang sticky-sidebar template with teal accents. It does not look like the person who built the Saizen site |
| Undeclared dependency | `framer-motion` is imported in four files and declared zero times in `package.json`; it resolves only as a transitive of `motion` and would fail a clean strict install |
| Dead code | Twelve of twenty-one files in `components/ui/` are unreferenced, including the only consumer of `three` |

---

## 2. Colour tokens

The two themes invert colour temperature, because that is what a real screen does at 2 AM. Day is cool ink on warm paper; night is warm amber on cold black. This is the justification for the palette and also the justification for the clock — they are one idea.

### Light — fountain-pen blue on warm paper

| Token | Value | Role |
|---|---|---|
| `--bg` | `#FAF7F2` | Page |
| `--panel` | `#F1ECE3` | Alternating section ground |
| `--ink` | `#14120F` | Body text |
| `--ink-soft` | `rgba(20,18,15,.64)` | Secondary prose |
| `--ink-faint` | `rgba(20,18,15,.42)` | Eyebrows, meta, mono labels |
| `--rule` | `rgba(20,18,15,.14)` | Hairlines, borders |
| `--accent` | `#1F3D8F` | Links, section marks, CTAs, selection |
| `--accent-soft` | `rgba(31,61,143,.10)` | Chip fills |

### Dark — night-shift amber on cold black

| Token | Value | Role |
|---|---|---|
| `--bg` | `#08090B` | Page |
| `--panel` | `#0E1013` | Alternating section ground |
| `--ink` | `#F5F2EC` | Body text |
| `--ink-soft` | `rgba(245,242,236,.66)` | Secondary prose |
| `--ink-faint` | `rgba(245,242,236,.42)` | Meta |
| `--rule` | `rgba(245,242,236,.15)` | Hairlines |
| `--accent` | `#FFB454` | as above |
| `--accent-soft` | `rgba(255,180,84,.12)` | Chip fills |

**Rules**

- One accent per theme. It always means "this is Suraj" — never a large background fill.
- No third hue. No decorative gradients; the only gradient in the build is the theme sweep's falloff.
- Deliberately distinct from the Saizen site's `#BC002D` / `#43FFD2`. The portfolio is the parent brand, not a Saizen sub-brand.
- Default theme comes from the clock (§6b), not from `prefers-color-scheme`.

---

## 3. Typography

Three roles, none of them framework defaults. The current site uses Geist Sans and Geist Mono — the Next.js defaults — which reads as no typographic choice having been made at all.

| Role | Face | Usage |
|---|---|---|
| Display | **Instrument Serif** 400 + italic | Name, section titles, project names. The *italic* carries the itch quotes — this is its main job. |
| Body | **Karla** 400/500/700 | All prose. Humanist grotesque, warm, deliberately not Inter. |
| Utility | **JetBrains Mono** 400/500 | Eyebrows, dates, versions, metrics, chips, buttons. Always uppercase, tracking `.14em`–`.20em`. |

All three load via `next/font/google` and are self-hosted at build time. JetBrains Mono continues from the LifeOS site — family resemblance confined to the utility layer.

**Scale:** fluid via `clamp()` throughout, no fixed breakpoint jumps.

- Hero name: `clamp(46px, 8.5vw, 104px)`
- Itch quote: `clamp(26px, 4.4vw, 52px)`
- Section title: `clamp(24px, 3.6vw, 40px)`
- Body: `clamp(15px, .5vw + 13.8px, 17px)`, line-height `1.6`
- Mono utility: fixed `11–12.5px`

`font-synthesis-weight: none` globally, carried from the LifeOS site spec.

---

## 4. Layout

**Grid:** single centred column, `max-width: 1180px`, fluid gutter `clamp(20px, 5vw, 68px)`.

**Section rhythm:** each section separated by a 1px `--rule` hairline, alternating `--bg` / `--panel` grounds. Vertical padding `clamp(56px, 9vh, 108px)`.

**The rail is one measurement, not five.** Every rail/content row — Now,
Work, Escaped, Ship log, Proof — shares `--rail` for the label column and
`--rail-gap` for the space beside it, so the content column starts at the
same x down the whole page. Setting a one-off gap on a single section breaks
the vertical line the reader is following; Work had drifted to a wider gap
and put itself visibly out of step with everything below it.

**Section headers** carry a two-part stack: a mono uppercase eyebrow above an Instrument Serif title, with an optional Karla lede in `--ink-soft`.

**Itch cards** use a two-column split at ≥900px: a `minmax(180px, 240px)` margin rail carrying the retired complaint as a mono note, and the content column carrying the build. Below 900px the rail collapses above the content.

---

## 5. Page structure

Single page. The only route besides `/` is the existing `/cv.pdf` passthrough.

| # | Section | Carries |
|---|---|---|
| 0 | Top rail (fixed, thin) | Wordmark · live IST clock · theme toggle |
| 1 | Hero | Name, thesis line, current role, primary links |
| 2 | Now | Three dated lines: day job, current build, last thing shipped |
| 3 | Work ★ | The signature. Itch → build, one per project |
| 4 | Escaped | Experience: Plivo, Jabsz, BharatCrest |
| 5 | Ship log | Dated release stream |
| 6 | Proof | Publication + DOI, education, certification |
| 7 | Off the clock | Personality: gacha cadence, anime, music, self-destroying Linux installs |
| 7 | Stack ledger | Grouped technologies, each cross-referenced to the project it was used in |
| 8 | Footer | Two columns: pitch and address beside a link rail, then one line of fine print |

### 5.1 Deliberate removals

- **`SkillNetwork`** (the orbiting graph) is removed. It is decorative and conveys less than a list. The **stack ledger** replaces it: mono, grouped by layer, each row cross-referenced to a real project. This converts "I know React" into "React → TravelEase, HRMatcher, AegisQA".
- **`background_canvas.tsx`** (mouse-follower blur + mesh gradient) is removed. The paper/night grounds carry the atmosphere.
- **`Magnetic`** hover is removed. The hover vocabulary is a 2px lift and nothing else.

### 5.2 Project order

Ranked by impact, not recency.

| # | Project | Headline facts |
|---|---|---|
| 1 | Saizen | v1.4.2 · Next.js + Capacitor 7 + Swift · custom AVPlayer, installable stream modules, AniSkip, offline queue |
| 2 | AegisQA | Six-role multi-LLM pipeline · FastAPI + Kafka + MinIO + PostgreSQL + n8n |
| 3 | NammaLakes | 17,000+ points/day from 3 sensors at 5s intervals · RabbitMQ · Isolation Forest · published |
| 4 | LifeOS | v1.0.2 · SwiftUI · Dynamic Island Live Activity · local-first · Face ID lock |
| 5 | nano-prune-canvas | Magnitude pruning + post-training quantization · React Flow graph · 26 embedded targets |
| 6 | Linux Starter Pack | 12 distributions · Textual TUI · 60% faster installs |
| 7 | llm-chat-navigator | Published on addons.mozilla.org |

TravelEase drops to the stack ledger. `i-made-an-oopsie` moves to **Off the clock**, where "I keep destroying my own Linux install" is an asset rather than a thin project card.

**AegisQA link gating:** AegisQA has no public repository as of this spec. Its card renders with architecture detail and no links until the repository is public, at which point `lib/content.ts` gains the URL and the card's links appear with no other change.

---

## 6. The two signatures

### 6a. The itch resolve

Each project enters the viewport as a single italic complaint at display size, alone on the section ground:

> *"Every anime client I tried wanted an account, an ad, or a subscription."*

As the card scrolls through, the complaint contracts and migrates into the left margin rail as a mono note, while the build resolves in beside it. No click; scroll progress drives it.

**Timing is anchored to the quote, not the card.** Progress runs on the
blockquote's own centre, from 95% of viewport height as it enters to 40% as
it clears the reading zone. The quote holds full opacity until its centre
reaches 61% — roughly 307px of travel on a 900px viewport, all of it on
screen — then fades as it rises past the middle. The build crossfades in
from 0.66 and is complete at 1.0, by which point the card sits comfortably
placed rather than half scrolled away.

This took three passes, and the first two failed for the same reason: they
tuned the curve while the *anchor* was wrong.

- v1 measured the card's top and used `opacity: 1 - p * 1.35`, which begins
  fading at the first pixel of scroll — about 0.004 viewport-heights at full
  strength, effectively none.
- v2 kept the card's top and widened the hold. But the quote is
  `align-self: center` in a tall stage, roughly 350px below the card top, so
  it was still *below the fold* for its entire full-opacity window and
  reached zero at the exact moment it arrived mid-screen. Better numbers,
  same invisible quote.
- v3 measures the quote itself. The curve barely matters once the anchor is
  right.

The lesson is worth keeping: when a scroll animation fires at the wrong
time, check what is being measured before touching the easing. The
`data-past` threshold that disables pointer events tracks the same
crossfade, so the quote stays selectable while it is the dominant element.

**Implementation constraints:**

- `transform` and `opacity` only. Never animate `width`, `height`, `top`, or `filter`.
- Scroll progress is read in a single shared `rAF`-throttled listener, not one per card.
- `IntersectionObserver` gates the work: cards outside the viewport are not measured at all.
- Under `prefers-reduced-motion`, both states render in their resolved positions with no transition. The complaint remains present and readable in the margin rail.
- The complaint text is real DOM text in both states, never a background image or pseudo-element — it must be selectable, findable, and in the accessibility tree.

### 6b. The Bengaluru clock

The top rail shows the live time in Asia/Kolkata, and that time picks the theme: **night from 22:00 to 06:00 in Suraj's timezone, not the visitor's.** Someone opening the site from London at 21:00 sees night mode because it is 02:30 where he is.

This is the honest version of the `isNightOwl` badge already present in `components/hero_section.tsx` — the instinct was already there, applied to the visitor's clock instead of his.

**Implementation constraints:**

- Theme resolution order: `localStorage` override, else the IST hour. `prefers-color-scheme` is not consulted — the clock is the point.
- An inline pre-paint script in `<head>` sets `data-theme` on `<html>` before first paint. No flash.
- The clock is computed with `Intl.DateTimeFormat` and `timeZone: 'Asia/Kolkata'` so it is correct regardless of visitor locale, and ticks on a single interval.
- Server render must not depend on time. The rail renders a stable placeholder until hydration to avoid a mismatch.
- **The transition is a warm-temperature sweep:** one fixed overlay, an amber gradient falloff, sweeping across the viewport. Total duration 520ms; the theme swaps at ~220ms so the new palette appears behind the sweep. Transform and opacity only, single element, `will-change: transform, opacity`, `pointer-events: none`, and a busy flag preventing overlapping sweeps.
- Under `prefers-reduced-motion`, the theme swaps instantly with no sweep.

---

## 7. Motion

Beyond the two signatures: **scroll reveal only.** `IntersectionObserver`, opacity plus `translateY(12px)`, fires once per element, unobserved after. No parallax, no scroll-linked animation, no counters, no marquees.

Hover: interactive elements lift 2px. That is the entire hover vocabulary.

**Cut from the current build:** the mouse-follower blur, magnetic buttons, the orbiting skill network, all GSAP, all WebGL.

---

## 8. Quality floor

- Responsive from the first line — fluid `clamp()` type and spacing. No horizontal overflow at any width from 320px up.
- Touch targets ≥44px.
- Focus visible: `2px solid var(--accent)` with offset on every interactive element.
- Reduced motion respected across all three motion systems (both signatures plus reveal).
- Real `<title>`, description, favicon, and OG image via the Next metadata conventions.
- Semantic landmarks; one `<h1>`; section headings in order.
- `viewport-fit=cover` with safe-area awareness.

---

## 9. Performance budget

| Item | Rule |
|---|---|
| 3D / WebGL | **None.** Out of scope. |
| Animation libraries | **None.** Reveal is roughly twenty lines of `IntersectionObserver`. |
| New runtime dependencies | **None.** Ideas from reference sites are ported by hand. |
| Fonts | Three families, self-hosted via `next/font/google`, `display: swap`. |
| Images | `next/image` only, WebP, explicit dimensions. |
| Scroll listeners | One shared `rAF`-throttled listener for the whole page. |

### 9.1 Dependency changes

**Remove:** `three`, `@types/three`, `gsap`, `@gsap/react`, `class-variance-authority`, `react-icons`, `motion`

**Add:** none

**Keep:** `next`, `react`, `react-dom`, `lucide-react`, `tailwindcss`

Removing `motion` also resolves the undeclared-`framer-motion` defect at the root rather than patching it, since the four files importing it are all deleted.

`clsx` and `tailwind-merge` went with them: their only consumer was the
shadcn `cn()` helper in `lib/utils.ts`, which no longer exists.

### 9.2 Upgrade ceiling

Two majors are held back by upstream incompatibility, not by choice. Both
should be retried when the blocking issue closes.

| Package | Held at | Latest | Blocker |
|---|---|---|---|
| `typescript` | 6.0.3 | 7.0.2 | `typescript-eslint` does not support the TS 7 API ([#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940)). `tsc` and `next build` both pass on 7; only `eslint` fails. |
| `eslint` | 9.39.5 | 10.9.1 | `eslint-plugin-react`, bundled inside `eslint-config-next@16`, throws at rule-creation time under ESLint 10. |

Brand icons were removed from `lucide-react` in v1, so the GitHub mark is
inlined at `components/icons/GithubMark.tsx`. Any future brand icon belongs
there too, not in a new dependency.

---

## 10. Architecture

```
app/
  layout.tsx            fonts, metadata, pre-paint theme script
  page.tsx              server component, composes sections
  globals.css           design tokens + primitives
  icon.tsx              favicon via Next metadata convention
  opengraph-image.tsx   OG/Twitter card via Next metadata convention
  resume/page.tsx       existing /cv.pdf passthrough, unchanged
components/
  chrome/TopRail.tsx        wordmark, clock, theme toggle
  chrome/ThemeSweep.tsx     the warm-temperature transition
  sections/Hero.tsx
  sections/Now.tsx
  sections/Work.tsx         maps content onto ItchCard
  sections/Escaped.tsx
  sections/ShipLog.tsx
  sections/Proof.tsx
  sections/OffTheClock.tsx
  sections/StackLedger.tsx
  sections/Footer.tsx
  ItchCard.tsx              signature 6a
  Reveal.tsx                IntersectionObserver wrapper
  SectionHeader.tsx         shared eyebrow + title + lede
lib/
  content.ts            all copy and data — single source of truth
  theme.ts              clock to theme, localStorage override
  time.ts               IST clock via Intl.DateTimeFormat
```

Only components that need browser APIs are `"use client"`: `TopRail`, `ThemeSweep`, `ItchCard`, `Reveal`. Everything else server-renders.

---

## 11. Content model

`lib/content.ts` exports typed records for every section. The shapes:

```ts
interface Project {
  slug: string;
  name: string;
  itch: string;          // the complaint, first person, no period-less fragments
  what: string;          // one sentence: what it actually is
  body: string;          // two to three sentences of substance
  facts: string[];       // mono chips — versions, counts, measured results
  stack: string[];
  repo?: string;         // absent until public (see §5.2 AegisQA gating)
  live?: string;
  note?: string;         // e.g. "published on addons.mozilla.org"
}
```

Experience, ship-log entries, proof items, ledger rows, and the "now" lines each get their own narrow interface in the same file.

### 11.1 Itch lines — status: DRAFT, pending author review

These are drafted from each repository's own README framing and **must be reviewed and rewritten by Suraj before launch.** They are the voice of the site; a line that does not sound like him is worse than no line.

| Project | Draft itch |
|---|---|
| Saizen | "Every anime client I tried wanted an account, an ad, or a subscription." |
| AegisQA | "Writing test cases out of a spec document is the least interesting part of shipping, and I kept doing it by hand." |
| NammaLakes | "Nobody notices a lake is dying until it already has." |
| LifeOS | "I kept missing things I had already told myself I would remember." |
| nano-prune-canvas | "You cannot tell whether a model fits on the device until after you have already compressed it." |
| Linux Starter Pack | "Fresh install, twelfth time, and I am looking up the package manager syntax again." |
| llm-chat-navigator | "The answer was somewhere in this chat, forty messages ago." |

`i-made-an-oopsie` uses its README line verbatim in **Off the clock**: "I am prone to making my Linux system go down the drains by doing things I clearly shouldn't."

---

## 12. Definition of done

- `npm run build` and `npm run lint` both clean.
- No horizontal scrollbar at 320px, 375px, 768px, 1024px, 1440px.
- Both themes render correctly, and the sweep runs once per toggle with no overlap on rapid clicks.
- With `prefers-reduced-motion: reduce`, every section is fully readable and both signatures degrade to static states.
- Every itch complaint is present in the DOM and selectable in both the entered and resolved states.
- No claim on the page lacks a source in `cv.tex` or a repo README.
- `footer` mailto is `surajsm218@gmail.com`; LinkedIn is `surajmenon60720`.
- `package.json` contains no removed dependency, and `node_modules` is not required to resolve any undeclared import.

---

## 13. Self-measurement and paper

Two additions that are neither interactions nor sections in their own right,
so the two-signature budget in §0 is untouched.

### 13.1 Removed: the page cost readout

The colophon, and later the footer, carried a live Performance API readout —
requests, bytes, script bytes, LCP. Cut on 2026-09-05 as noise: a visitor who
cares about page weight can open the network panel, and it was the last
surviving piece of the site talking about itself. `components/PageCost.tsx`
and `lib/page-cost.ts` are deleted; one quip that pointed at it was rewritten
rather than left standing as a false statement.

### 13.2 Print

`Cmd-P` produces a typeset document on white, not a screenshot of a dark
website. The stylesheet forces the light palette regardless of the active
theme, drops the chrome, and sets page-break rules so a project or a role
never splits across a page.

Two rules carry most of the weight:

- **Every deferred state resolves.** `.reveal` sits at `opacity: 0` until
  observed, and an itch card's build is transform-driven. Without an
  explicit print override, any section the reader had not scrolled to would
  print as an empty box.
- **Whole sections, not their innards.** `#rhythm` is hidden entirely
  rather than having its contents hidden, since hiding a chart while keeping
  its heading prints an orphan title over blank space.

The contact line that replaces the icon links on paper is rendered from
`lib/content.ts` and revealed by the print stylesheet. It is never a CSS
`content` string — that would duplicate the contact details outside the
single source of truth in §0.

---

## 14. The second clock

The theme runs on Suraj's clock (§6b). The hero greeting runs on the
**visitor's**, and the page says both out loud.

> *Good evening. Prime time — a name broadcast television left behind.*
> Right now it is already 03:00 tomorrow where he is.

This is the fourth wall, and it earns its place by being accurate rather than
clever: a portfolio that greets you by your own hour and then reports its
author's is stating two true things, where most sites pretend the reader has
no location at all. It also completes the argument §6b started — once the
page has told you it is late in Bengaluru, it owes you the comparison.

**Bands** (visitor local hour): `<5` and `>=22` "Up late", `<12` "Good
morning", `<17` "Good afternoon", `<22` "Good evening".

**Hour notes** — `hourNotes[0..23]` in `lib/content.ts`, four lines per hour
saying what that hour is generally like. One is chosen per visit.

The pick is held per hour, not per call. `compute()` runs from `getSnapshot`
during render, so re-rolling on every call would hand React a new value each
time and loop forever; re-rolling only when the hour turns also stops the
line flickering on the 30-second tick. Randomness is safe here only because
the greeting never server-renders — there is no markup for it to mismatch.

Two rules govern what may go in one:

- **A note describes the hour, never Suraj.** The greeting runs on the
  reader's clock, so anything keyed to his data — his peak commit hours, the
  chart in §Rhythm — would be false for every reader outside IST. That
  temptation is exactly why the rule is written down.
- **No invented statistics.** Where a note asserts something it is something
  that holds generally: the circadian low, postprandial somnolence, solar
  noon drifting from clock noon. The rest are plainly observational, and read
  as observation rather than measurement.
- **It must be true on the day it appears.** The first version was hour-only.
  Sixteen of ninety-six lines assumed a working day, so a Sunday at 09:00
  claimed standup was running long and the markets were opening. Nine hours
  now carry a weekend set and 17:00 carries a Friday one; selection is
  friday, then weekend, then weekday. All 168 hour/day combinations resolve.

**The gap clause** reports his wall-clock time, and names the day shift when
his date differs from the visitor's ("already 03:00 tomorrow", "still 21:30
yesterday"). When both clocks are in the small hours it collapses to a single
line — "so this is late for both of us" — which outranks the day shift.

### 14.1 Constraints

- **Never server-rendered.** A server-side "Good morning" is wrong for most
  of the planet, so the greeting is absent from the HTML and appears on
  hydration. Same external-store shape as the theme and the cost row.
- `getSnapshot` caches but never notifies. It runs during render, so
  notifying from it would be a render-phase side effect; a separate `pull()`
  does the caching and `refresh()` alone notifies.
- The store only swaps its reference when a reader would notice — greeting
  band, hour note, his clock, day shift, or the both-late flag. A 30-second tick that
  re-rendered the hero for an unchanged minute would be waste.

### 14.2 Quips

One self-aware line under the thesis, picked at random per visit and cycled
on click.

- **Every quip is checkable against the page it sits on.** The prime
  directive in §0 gets no comedy exemption: a joke that invented a fact would
  be the only lie on a page whose entire argument is that it contains none.
- **Not on a timer.** Text that changes while it is being read is an
  accessibility problem, not a delight. The reader asks for the next one.
- The random pick happens in a ref callback, after mount — picking during
  render would hydrate a mismatch, and an effect body would trip the
  set-state-in-effect rule for good reason.
- Space for two lines is reserved so cycling never nudges the buttons below.
- Both the greeting and the quip are hidden in print (§13.2). Neither is
  about Suraj. The print rule targets the `.hero__hail` wrapper, not
  `.hero__greeting`: hiding the greeting alone strands the clock line
  beneath it as an orphan reading on paper.
- Quips reference page features, so removing a feature means auditing them.
  Dropping the colophon (§15) invalidated two, and both were rewritten
  rather than left standing as the only false statements on the page.

Neither addition is a signature interaction, so the budget in §0 stands: the
greeting has no interaction at all, and the quip's click is a content
control, not a motion system.

---

## 15. Removed: the colophon

The colophon — design notes, the site's own changelog, and links to the
three design documents — was cut on 2026-09-04 as self-indulgent. It
described the website to an audience that came to read about its author.

What survived and where it went:

| Was in the colophon | Now |
|---|---|
| Page cost readout | Moved to the footer, then removed entirely (§13.1) |
| Link to this site's source | Footer, in the links row |
| Design notes, changelog, design-doc links | Removed |

`lib/content.ts` keeps `site.version` as metadata even though nothing renders
it. Recoverable from git if the changelog is ever wanted back:
`git show fb7e654 -- components/sections/Colophon.tsx`.

The two-signature budget is unaffected; the colophon was never one.

---

## 16. Weekly GitHub sync

The Rhythm chart and the release half of the Ship log regenerate weekly from
GitHub instead of being maintained by hand. The previous site rotted for nine
months because every number on it needed a person; §0 moved the copy into one
file, and this moves the *facts* out of human hands entirely.

**Where it runs.** A GitHub Actions cron (`30 0 * * 1`, 06:00 Monday in
Bengaluru) regenerates `lib/commit-hours.json` and `lib/ship-log.json`,
commits them if they changed, and lets Vercel's git integration redeploy.
Not a Vercel cron and not a build-time fetch: the data stays committed and
diffable, the build still needs no network, and nothing extra ships to the
client.

### 16.1 Why it clones instead of using the commits API

The REST API normalises commit dates to UTC and discards the author's
timezone offset:

```
git log      2026-08-22T20:48:45+05:30   ← true local hour, 20
GitHub API   2026-08-22T15:18:45Z        ← offset gone
```

The chart is explicitly about local hours. Rebuilding it from the API means
assuming IST for every commit — an assumption that currently reproduces the
real distribution exactly, and would break silently the first time Suraj
commits from another timezone. The workflow clones each repository with
`--filter=tree:0 --bare`, which fetches commit metadata and nothing else, and
reads the offset straight out of `git log`.

### 16.2 What is generated and what is not

Only Saizen cuts GitHub releases; every other repository has none. So the
ship log is a merge:

| Source | Holds |
|---|---|
| `lib/ship-log.json` (generated) | GitHub releases — tag, date, summary, link |
| `shipLogCurated` in `lib/content.ts` | Everything GitHub cannot see: the IJLTEMAS paper, starting at Plivo, the add-on reaching the Firefox store, the two marketing sites, and Saizen 1.4.2, which its own README says shipped in-app rather than as a release IPA |

Merged, sorted, and capped at `SHIP_LOG_LIMIT`, with a count of what the cap
hides. An automated feed grows without bound; a highlight reel should not.

### 16.3 Failure modes, handled

- **Partial release list.** A rate limit mid-run would drop entries from the
  ship log. The script tracks completeness and leaves `ship-log.json`
  untouched rather than writing a truncated one, exiting non-zero. The hours
  half, which needs no API, still writes.
- **Partial clone failure.** The workflow refuses to commit when the totals
  fall below a floor, so a bad network run cannot silently erase the chart.
- **Stale prose over fresh data.** The Rhythm lede is composed from the
  peaks in the data rather than asserted over them. It previously read "Two
  peaks, not one: before the day starts and after it ends" — a hand-written
  reading of a snapshot. Once the numbers began syncing, that sentence was a
  claim nobody was checking, and the first drift would have made it the only
  false statement on the page. Anything automated must have its prose derived
  from the same source, or say nothing that can go stale.

### 16.4 Scope

Public repositories Suraj owns, excluding forks — the set a visitor can
verify against his profile. Private work would inflate a number nobody can
check. Two authoring addresses are counted; merges are excluded.

---

## 17. The pad and the sky

The hero's right half carries a four-way pad, drawn as pixel art in SVG.
It is the gamer half of the person made functional rather than decorative:
it is a sprite, and it does work.

| Direction | Action |
|---|---|
| Up | Scroll to the top; once there, the night sky arrives from overhead |
| Down | Next section |
| Left | Previous section |
| Right | Jump to contact |

Left and right are placeholders until they are decided. They have real
behaviour rather than sitting inert, because a control that does nothing
reads as broken.

### 17.1 Rules

- **The arrow keys are never bound globally.** Taking them from the browser
  breaks scrolling for every keyboard user, which costs far more than this
  control is worth. The pad is a focusable group; arrows drive it only while
  focus is inside it.
- **One arrow shape, rotated.** A three-step head over a stem on a 12×12
  grid, every band two units tall so the stair reads as pixels rather than as
  a jagged triangle. Turned in CSS for the other three directions. The first
  draft hand-wrote four paths and all four were wrong — geometry that cannot
  be seen should not be guessed at four times.
- **It is drawn as a sprite, not as UI.** No radius, no gradients, no blurred
  shadows anywhere. The raised look is four inset box-shadows acting as a
  pixel bevel — light along the top and left, dark along the bottom and right
  — and pressing inverts them, which is how a button has read as pressed
  since the 8-bit era. The hub inverts permanently, so the centre reads as
  sunk into the cross. A two-step stair is cut from the outer corners of each
  arm; without it the cross reads as five plain squares. The pad casts a hard
  offset `drop-shadow` with zero blur, because a sprite casts a shape.
- Its palette is four dedicated tokens per theme (`--pad-face`, `--pad-hi`,
  `--pad-lo`, `--pad-edge`) rather than the page's, since a bevel needs a
  lit side and a shaded side that the content tokens do not provide.
- The night sky is a **sibling** of the pad, never a child. `filter` creates
  a containing block, and a `position: fixed` panel inside a filtered
  ancestor stops being fixed.
- **Feedback is colour, not movement.** An earlier version scaled the key on
  press and fired a burst of stars on the way up. Both read as aggressive.
  The pad now shifts colour and nothing moves.
- The hub is a position read-out — one pip per landmark, filled to wherever
  the page is — rather than a dead centre piece.

### 17.2 The sky

Pressing up scrolls back to the beginning and then keeps going.

The sequence, in order:

1. The page scrolls smoothly to the top.
2. The sky fades in and the stars arrive as **long vertical trails falling
   downward** — the world moving the opposite way to the reader, which is
   what sells the travel. Three lanes at 120, 190 and 80px, staggered across
   nine offsets so they do not land as one flat curtain.
3. Each trail shortens into a point and begins to twinkle on a 5.2s cycle.
4. One line fades up at 1150ms.

Nothing else is up there. It is a room, not another section — an earlier
version put the off-the-clock material in it and that was one thing too many.

- **The trail is `scaleY` on a fixed 2px dot, never an animated height**, so
  the whole sequence is transform and opacity and never touches layout.
- Star positions are a fixed list, not randomised — the same sky every time,
  and nothing to hydrate.
- The line is chosen in the click handler that opens the sky, never in an
  effect and never during render. It is unattributed on purpose: a famous
  quotation would be the one thing here nobody could check, and
  misattribution is the usual way that goes wrong.
- It is a modal: Escape and a close button dismiss it, the close button takes
  focus on open, the panel is `inert` while shut, and body scroll is locked
  while it is open so the reader cannot move content they cannot see.
- Under `prefers-reduced-motion` there is no fall and no twinkle — the stars
  are simply there and so is the line.
- Hidden in print, along with the pad.

---

## 18. Where the pixel language applies

The pad made a second visual language available. Left ungoverned it would
have spread until the page was a costume, so it has a rule:

> **Pixel treatment goes to things you press and things that are counted.**
> Prose, headings and the itch quotes stay typographic.

That divides cleanly:

| Pressed | Counted | Neither |
|---|---|---|
| The pad · `.action` buttons · the theme toggle · the sky's close | Rhythm bars · the hub's pips · chips | Every heading, every paragraph, the itch quotes, the greeting, the thesis |

**Pressed** surfaces share `--bevel-out` and swap to `--bevel-in` while
active — one pair of tokens, so a fifth button cannot invent a sixth bevel.
Depth is set per surface through `--bv`: the pad is 3px because it is a
sprite, a text button is 2px because it should nod at one rather than dress
as one.

**Counted** surfaces are segmented rather than continuous. The Rhythm bars
are masked into 5px cells with 2px gaps, because a count should look
countable and a stack of cells is how a sprite-era meter reads a quantity.
Chips lose their radius for the same reason a bar loses its rounded cap.

What deliberately did **not** change: the display serif, all body copy, the
itch quotes, the greeting, section headings, and the night sky's interior.
The pixel work is the gamer half of the person; the typography is the half
that writes design documents. Both are true and neither should swallow the
other.

Contrast was rechecked after the buttons changed ground: 13.85:1 and 13.57:1
for button text on the pad face in light and dark, and both primary variants
above 9:1.
