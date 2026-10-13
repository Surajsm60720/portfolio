/**
 * Regenerates the data files the site renders from GitHub:
 *
 *   lib/commit-hours.json     — hour-of-day distribution behind the Rhythm chart
 *   lib/ship-log.json         — releases, merged at render with the curated
 *                               entries in lib/content.ts
 *   lib/project-versions.json — marketing versions for Work-card chips
 *                               (Tether, Saizen, LifeOS)
 *
 * Run weekly by .github/workflows/sync-github.yml, and by hand with:
 *
 *   node scripts/sync-github.mjs
 *
 * Why it clones instead of reading the commits API
 * ------------------------------------------------
 * The REST API normalises commit dates to UTC and discards the author's
 * timezone offset:
 *
 *   git log      2026-08-22T20:48:45+05:30   <- true local hour, 20
 *   GitHub API   2026-08-22T15:18:45Z        <- offset gone
 *
 * The chart is explicitly about local hours, so rebuilding it from the API
 * would mean assuming IST for every commit. That assumption happens to hold
 * today and would break silently the first time Suraj commits from another
 * timezone. Cloning with --filter=tree:0 fetches commit metadata and nothing
 * else, which is small and fast, and `git log` keeps the offset.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CACHE = join(ROOT, ".repo-cache");
const VERSIONS_PATH = join(ROOT, "lib", "project-versions.json");
const USER = "Surajsm60720";

/**
 * Apps whose Work-card version chip must stay current. GitHub Releases alone
 * are not enough: Saizen ships patch versions in-app without a new Release
 * IPA, and LifeOS has no Releases at all. For each app we take the highest
 * semver found across the latest Release tag and the README header.
 */
const VERSIONED = [
  { slug: "tether", repo: "Tether" },
  { slug: "saizen", repo: "Saizen" },
  { slug: "lifeos", repo: "LifeOS" },
];

/** Both addresses Suraj has authored with. */
const AUTHORS = ["1ds22is166@dsce.edu.in", "surajsm218@gmail.com"];

const token = process.env.GITHUB_TOKEN;
const headers = {
  accept: "application/vnd.github+json",
  "user-agent": "portfolio-sync",
  ...(token ? { authorization: `Bearer ${token}` } : {}),
};

class RateLimited extends Error {}

async function api(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      const reset = Number(res.headers.get("x-ratelimit-reset") || 0) * 1000;
      throw new RateLimited(
        `GitHub rate limit reached${reset ? `, resets ${new Date(reset).toLocaleTimeString()}` : ""}. ` +
          (token
            ? "Even with a token — try again shortly."
            : "Set GITHUB_TOKEN to raise the allowance from 60/hour to 5,000."),
      );
    }
  }
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status} ${res.statusText}`);
  return res.json();
}

const git = (args, cwd) =>
  execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

/* ------------------------------------------------------------ repos --- */

/** Public, owned, not a fork — the set a visitor can verify from the profile. */
async function listRepos() {
  const out = [];
  for (let page = 1; page <= 5; page += 1) {
    const batch = await api(`/users/${USER}/repos?per_page=100&type=owner&page=${page}`);
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out.filter((r) => !r.fork && !r.private).map((r) => r.name);
}

function mirror(name) {
  const path = join(CACHE, `${name}.git`);
  if (existsSync(path)) {
    try {
      git(["fetch", "--quiet", "--filter=tree:0", "origin", "+refs/heads/*:refs/heads/*"], path);
      return path;
    } catch {
      rmSync(path, { recursive: true, force: true });
    }
  }
  git([
    "clone", "--quiet", "--bare", "--filter=tree:0", "--no-tags",
    `https://github.com/${USER}/${name}.git`, path,
  ]);
  return path;
}

/* ------------------------------------------------------------ hours --- */

function hoursFor(path) {
  const args = ["log", "--all", "--no-merges", "--pretty=%ad", "--date=format:%H"];
  for (const author of AUTHORS) args.push(`--author=${author}`);
  const out = git(args, path).trim();
  return out ? out.split("\n") : [];
}

/* --------------------------------------------------------- versions --- */

function normalizeVersion(raw) {
  const m = String(raw).match(/v?(\d+(?:\.\d+)*)/i);
  return m ? `v${m[1]}` : null;
}

function semverParts(v) {
  return v.replace(/^v/i, "").split(".").map((n) => Number(n) || 0);
}

/** Highest semver wins; equal lengths compare component-wise. */
function maxVersion(candidates) {
  const versions = candidates.filter(Boolean);
  if (!versions.length) return null;
  return versions.sort((a, b) => {
    const A = semverParts(a);
    const B = semverParts(b);
    const n = Math.max(A.length, B.length);
    for (let i = 0; i < n; i += 1) {
      const d = (B[i] || 0) - (A[i] || 0);
      if (d) return d;
    }
    return 0;
  })[0];
}

/** Marketing version from a README — the patterns these three repos use. */
function versionFromReadme(text) {
  const patterns = [
    /Saizen\s*[·•]\s*v?(\d+(?:\.\d+)*)/i,
    /\*\*Version\s+v?(\d+(?:\.\d+)*)\*\*/i,
    /^Version\s+v?(\d+(?:\.\d+)*)\.?\s*$/im,
    /^#\s+[^\n]*?\bv(\d+(?:\.\d+)*)\b/m,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) return normalizeVersion(m[1]);
  }
  return null;
}

async function latestReleaseVersion(repo) {
  try {
    const r = await api(`/repos/${USER}/${repo}/releases/latest`);
    return normalizeVersion(r.tag_name);
  } catch (err) {
    /* 404 = no releases (LifeOS). Anything else should surface. */
    if (String(err.message).includes("-> 404")) return null;
    throw err;
  }
}

async function readmeVersion(repo) {
  /* default_branch varies (main vs master); the API resolves the default. */
  const res = await fetch(
    `https://api.github.com/repos/${USER}/${repo}/readme`,
    { headers: { ...headers, accept: "application/vnd.github.raw" } },
  );
  if (res.status === 404) return null;
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      throw new RateLimited("GitHub rate limit reached while reading READMEs.");
    }
  }
  if (!res.ok) throw new Error(`GET /repos/${USER}/${repo}/readme -> ${res.status}`);
  return versionFromReadme(await res.text());
}

async function resolveVersions(previous) {
  const versions = { ...(previous.versions || {}) };
  const sources = {};
  for (const { slug, repo } of VERSIONED) {
    let fromRelease = null;
    let fromReadme = null;
    try {
      fromRelease = await latestReleaseVersion(repo);
      fromReadme = await readmeVersion(repo);
    } catch (err) {
      if (err instanceof RateLimited) throw err;
      console.warn(`  version ${repo}: ${err.message}`);
    }
    const next = maxVersion([fromRelease, fromReadme]);
    if (next) {
      versions[slug] = next;
      const parts = [];
      if (fromRelease) parts.push(`release ${fromRelease}`);
      if (fromReadme) parts.push(`readme ${fromReadme}`);
      sources[slug] = parts.join(" · ") || "resolved";
    } else if (versions[slug]) {
      sources[slug] = `kept previous ${versions[slug]}`;
      console.warn(`  version ${repo}: no live source; kept ${versions[slug]}`);
    } else {
      throw new Error(
        `No version for ${repo} (${slug}) and nothing previous to keep. ` +
          "Seed lib/project-versions.json or publish a Release / README version.",
      );
    }
  }
  return { versions, sources };
}

/* --------------------------------------------------------- releases --- */

/** First line of a release body that reads as a sentence, not scaffolding. */
function summarise(body) {
  const lines = (body || "").split("\n").map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.startsWith("|") || line.startsWith("---")) continue;
    let text = line;
    if (text.startsWith("#")) {
      text = text.replace(/^#+\s*/, "");
      const dash = text.split(/\s[—–-]\s/);
      text = dash.length > 1 ? dash.slice(1).join(" - ") : "";
      if (!text) continue;
    }
    text = text.replace(/^[-*]\s*/, "").replace(/\*\*/g, "").replace(/[:]\s*$/, "").trim();
    if (text.length < 12) continue;
    return text.length > 130 ? `${text.slice(0, 127).replace(/\s\S*$/, "")}…` : text;
  }
  return "";
}

/* ------------------------------------------------------------- main --- */

const repos = await listRepos();
mkdirSync(CACHE, { recursive: true });

const hours = new Array(24).fill(0);
const counted = [];
const releases = [];
let releasesComplete = true;

for (const name of repos) {
  let path;
  try {
    path = mirror(name);
  } catch (err) {
    console.warn(`  skip ${name}: clone failed (${err.message.split("\n")[0]})`);
    continue;
  }

  const found = hoursFor(path);
  if (found.length) {
    for (const h of found) hours[Number(h)] += 1;
    counted.push({ repo: name, commits: found.length });
  }

  /* A partial release list is worse than no update: it would silently drop
     entries from the ship log. If the API cuts us off, the hours half still
     gets written and the ship log is left exactly as it was. */
  if (!releasesComplete) continue;
  try {
    const rels = await api(`/repos/${USER}/${name}/releases?per_page=100`);
    for (const r of rels) {
      if (r.draft) continue;
      releases.push({
        date: (r.published_at || r.created_at).slice(0, 10),
        label: `${name} ${r.tag_name}`,
        detail: summarise(r.body),
        href: r.html_url,
      });
    }
  } catch (err) {
    if (!(err instanceof RateLimited)) throw err;
    releasesComplete = false;
    console.warn(`  ${err.message}`);
  }
}

const total = hours.reduce((a, b) => a + b, 0);

/** The two busiest hours, so the section's lede can be written from the data
    rather than asserted over it. */
const peaks = hours
  .map((n, h) => ({ h, n }))
  .sort((a, b) => b.n - a.n)
  .slice(0, 2)
  .map((x) => x.h)
  .sort((a, b) => a - b);

const generated = new Date().toISOString().slice(0, 10);

await writeFile(
  join(ROOT, "lib", "commit-hours.json"),
  `${JSON.stringify({ generated, total, repos: counted, hours, peaks }, null, 2)}\n`,
);

console.log(`${total} commits across ${counted.length} of ${repos.length} repositories`);
console.log(`peak hours: ${peaks.map((h) => `${String(h).padStart(2, "0")}:00`).join(" and ")}`);

if (!releasesComplete) {
  console.error("ship-log.json left unchanged — the release list was incomplete.");
  process.exit(1);
}

releases.sort((a, b) => b.date.localeCompare(a.date));
await writeFile(
  join(ROOT, "lib", "ship-log.json"),
  `${JSON.stringify({ generated, entries: releases }, null, 2)}\n`,
);
console.log(`${releases.length} releases`);

const previousVersions = existsSync(VERSIONS_PATH)
  ? JSON.parse(readFileSync(VERSIONS_PATH, "utf8"))
  : { versions: {} };

let versioned;
try {
  versioned = await resolveVersions(previousVersions);
} catch (err) {
  if (err instanceof RateLimited) {
    console.error(`project-versions.json left unchanged — ${err.message}`);
    process.exit(1);
  }
  throw err;
}

await writeFile(
  VERSIONS_PATH,
  `${JSON.stringify({ generated, versions: versioned.versions, sources: versioned.sources }, null, 2)}\n`,
);
for (const { slug, repo } of VERSIONED) {
  console.log(`${repo}: ${versioned.versions[slug]} (${versioned.sources[slug]})`);
}
