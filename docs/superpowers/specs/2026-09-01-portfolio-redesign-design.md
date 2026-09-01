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

> Suraj builds software with a user base of one. Sometimes it escapes.

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
| 8 | Stack ledger | Grouped technologies, each cross-referenced to the project it was used in |
| 9 | Footer | Real mailto, correct socials, resume |

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
