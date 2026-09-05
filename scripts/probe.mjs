/**
 * Opens the running dev server in a real engine, enters console mode with the
 * Konami code, and writes .probe-<engine>.png.
 *
 *   npm run dev
 *   node scripts/probe.mjs            # Chrome
 *   node scripts/probe.mjs webkit     # Safari's engine
 *   node scripts/probe.mjs firefox
 *
 * This exists because several defects here were invisible to the build, the
 * types, the lint and the served markup, and only a rendered page disagreed:
 * a stylesheet whose braces trapped half its rules inside @media print, font
 * tokens composed at :root from variables declared on <body>, and a control
 * that rendered everywhere except the one browser being reported. All of them
 * looked perfect in every text-based check.
 */
import { chromium, webkit, firefox } from "playwright";

const which = process.argv[2] ?? "chrome";
const engines = { chrome: chromium, chromium, webkit, firefox };
const engine = engines[which];
if (!engine) {
  console.error(`unknown engine: ${which}`);
  process.exit(1);
}

const browser = await engine.launch(
  which === "chrome" ? { channel: "chrome", headless: true } : { headless: true },
);
const page = await browser.newPage({
  viewport: { width: 1470, height: 830 },
  colorScheme: "dark",
});

const problems = [];
page.on("pageerror", (e) => problems.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") problems.push(`console: ${m.text().slice(0, 160)}`);
});

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(900);

const normal = await page.evaluate(() => {
  const c = document.querySelector(".console");
  return c ? getComputedStyle(c).display : "NOT IN DOM";
});

for (const k of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
  await page.keyboard.press(k.length === 1 ? `Key${k.toUpperCase()}` : k);
}
await page.waitForTimeout(900);

const consoleMode = await page.evaluate(() => {
  const c = document.querySelector(".console");
  const p = document.querySelector(".page");
  if (!c || !p) return "NOT IN DOM";
  const cb = c.getBoundingClientRect();
  const pb = p.getBoundingClientRect();
  return {
    dataset: { ...document.documentElement.dataset },
    size: `${Math.round(cb.width)}x${Math.round(cb.height)}`,
    gap: `${Math.round(cb.top - pb.bottom)}px`,
  };
});

console.log(`${which}: console in normal mode -> ${normal}`);
console.log(`${which}: console mode -> ${JSON.stringify(consoleMode)}`);
console.log(`${which}: problems -> ${problems.length ? problems.join(" | ") : "none"}`);

await page.screenshot({ path: `.probe-${which}.png` });
await browser.close();
process.exit(problems.length ? 1 : 0);
