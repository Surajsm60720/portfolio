/**
 * Structural check for app/globals.css.
 *
 * Every defect this catches has actually shipped at least once. Editing this
 * file with regular expressions has twice produced CSS that is perfectly
 * valid and completely wrong — a rule swallowed from a grouped selector left
 * the remainder dangling into the next rule, and an insertion landed inside
 * @media print, trapping seventeen thousand characters of the stylesheet
 * behind a query that never matches on screen.
 *
 * Nothing else caught either one. Build, types and lint all passed; only the
 * rendered page was wrong. Run this after any structural edit:
 *
 *   node scripts/check-css.mjs
 */
import { readFileSync } from "node:fs";

const FILE = "app/globals.css";
const css = readFileSync(FILE, "utf8");
const lines = css.split("\n");
const problems = [];

/* 1. Braces balance, and every top-level rule closes. */
let depth = 0;
let openedAt = null;
lines.forEach((line, i) => {
  const before = depth;
  depth += (line.match(/\{/g) ?? []).length - (line.match(/\}/g) ?? []).length;
  if (before === 0 && depth > 0) openedAt = { line: i + 1, text: line.trim() };
  if (depth === 0) openedAt = null;
  if (depth < 0) {
    problems.push(`${FILE}:${i + 1} unbalanced closing brace`);
    depth = 0;
  }
});
if (depth !== 0 && openedAt) {
  problems.push(`${FILE}:${openedAt.line} never closed — ${openedAt.text}`);
}

/* 2. No @media inside another @media, which is how an insertion in the wrong
      place hides half the stylesheet behind a query that never matches. */
for (const match of css.matchAll(/@media[^{]*\{/g)) {
  let d = 0;
  let j = match.index + match[0].length - 1;
  for (; j < css.length; j += 1) {
    if (css[j] === "{") d += 1;
    else if (css[j] === "}" && (d -= 1) === 0) break;
  }
  const body = css.slice(match.index + match[0].length, j);
  if (body.includes("@media")) {
    const line = css.slice(0, match.index).split("\n").length;
    problems.push(`${FILE}:${line} nested @media inside ${match[0].trim()}`);
  }
}

/* 3. A selector list ending in a comma before a blank line — the signature of
      a selector removed from a group, leaving the rest to bind to whatever
      rule follows. */
for (const match of css.matchAll(/([^\n]*,)\n\n/g)) {
  const line = css.slice(0, match.index).split("\n").length;
  problems.push(`${FILE}:${line} dangling selector — ${match[1].trim()}`);
}

/* 4. Empty blocks. */
for (const match of css.matchAll(/\{\s*\}/g)) {
  problems.push(`${FILE}:${css.slice(0, match.index).split("\n").length} empty block`);
}

if (problems.length) {
  console.error(`${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`${FILE} — braces balanced, no nested @media, no dangling selectors.`);
