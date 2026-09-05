/**
 * Opens the running dev server in real Chrome, enters console mode with the
 * Konami code, and writes .probe.png.
 *
 * This exists because several defects on this site were invisible to the
 * build, the types, the lint and the served markup, and only a rendered page
 * disagreed: a stylesheet whose braces trapped half the rules inside
 * @media print, and font tokens composed at :root from variables declared on
 * <body>. Both looked perfect in every text-based check.
 *
 *   npm run dev
 *   node scripts/probe.mjs
 */
import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1470, height: 830 }, colorScheme: "dark" });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
for (const k of ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"])
  await page.keyboard.press(k.length === 1 ? `Key${k.toUpperCase()}` : k);
await page.waitForTimeout(900);
await page.screenshot({ path: ".probe.png" });
const g = await page.evaluate(() => {
  const r = (s) => { const n = document.querySelector(s); if (!n) return "MISSING";
    const b = n.getBoundingClientRect(); return `${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)}`; };
  return { rail: r(".rail"), page: r(".page"), console: r(".console"), overlap:
    (() => { const p = document.querySelector(".page").getBoundingClientRect();
             const c = document.querySelector(".console").getBoundingClientRect();
             return p.bottom > c.top ? "OVERLAP" : `${Math.round(c.top - p.bottom)}px gap`; })() };
});
console.log(JSON.stringify(g, null, 2));
await browser.close();
