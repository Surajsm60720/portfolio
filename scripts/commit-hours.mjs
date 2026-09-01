/**
 * Regenerates lib/commit-hours.json — the hour-of-day distribution behind the
 * "when the work happens" bar row and the night threshold.
 *
 * Reads local clones rather than the GitHub API on purpose: the site must
 * build with no network access, so the data is a committed snapshot, not a
 * fetch. Re-run this when the picture has meaningfully changed:
 *
 *   node scripts/commit-hours.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CODES = resolve(ROOT, "..");

/** Only Suraj's own repositories; forks and vendored code would skew this. */
const REPOS = [
  "portfolio",
  "Saizen",
  "Saizen-website",
  "LifeOS",
  "LifeOS-website",
  "nano-prune-canvas",
  "Resume",
];

const AUTHORS = ["1ds22is166@dsce.edu.in", "surajsm218@gmail.com"];

const hours = new Array(24).fill(0);
const included = [];

for (const repo of REPOS) {
  const path = join(CODES, repo);
  if (!existsSync(join(path, ".git"))) continue;

  const args = ["-C", path, "log", "--no-merges", "--pretty=%ad", "--date=format:%H"];
  for (const author of AUTHORS) args.push(`--author=${author}`);

  const out = execFileSync("git", args, { encoding: "utf8" }).trim();
  if (!out) continue;

  const lines = out.split("\n");
  for (const line of lines) hours[Number(line)] += 1;
  included.push({ repo, commits: lines.length });
}

const total = hours.reduce((a, b) => a + b, 0);
const mean = total / 24;

/** Night is the contiguous evening run of above-average hours. */
const above = hours.map((n) => n > mean);

await writeFile(
  join(ROOT, "lib", "commit-hours.json"),
  `${JSON.stringify(
    {
      generated: new Date().toISOString().slice(0, 10),
      total,
      repos: included,
      hours,
      aboveAverage: above.reduce((acc, on, h) => (on ? [...acc, h] : acc), []),
    },
    null,
    2,
  )}\n`,
);

console.log(`${total} commits across ${included.length} repositories`);
console.log(hours.map((n, h) => `${String(h).padStart(2, "0")} ${n}`).join("  "));
