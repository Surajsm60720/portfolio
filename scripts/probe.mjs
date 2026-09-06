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
 * tokens composed at :root from variables declared on <body>, a control that
 * rendered everywhere except the one browser being reported, and a CRT glass
 * that painted underneath the screen it was laid over because its parent
 * carried a filter. All of them looked perfect in every text-based check.
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

const normal = await page.evaluate(() => ({
  shell: document.querySelector(".shell") ? "IN DOM" : "absent",
  rail: getComputedStyle(document.querySelector(".rail")).display,
}));

for (const k of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]) {
  await page.keyboard.press(k.length === 1 ? `Key${k.toUpperCase()}` : k);
}
await page.waitForTimeout(900);

const consoleMode = await page.evaluate(() => {
  const shell = document.querySelector(".shell");
  const screen = document.querySelector(".page");
  const fx = document.querySelector(".screen-fx");
  if (!shell || !screen || !fx) return "NOT IN DOM";
  const s = shell.getBoundingClientRect();
  const p = screen.getBoundingClientRect();
  const f = fx.getBoundingClientRect();
  return {
    dataset: { ...document.documentElement.dataset },
    rail: getComputedStyle(document.querySelector(".rail")).display,
    shell: `${Math.round(s.width)}x${Math.round(s.height)}`,
    screen: `${Math.round(p.width)}x${Math.round(p.height)}`,
    /* The overlay carrying the scanlines and the announcements is a sibling
       of the screen, not a child, so the two boxes agreeing is the thing
       worth checking. */
    overlayAligned:
      Math.round(p.x) === Math.round(f.x) &&
      Math.round(p.y) === Math.round(f.y) &&
      Math.round(p.width) === Math.round(f.width) &&
      Math.round(p.height) === Math.round(f.height),
    overflow: screen.scrollHeight - screen.clientHeight,
    stars: document.querySelectorAll(".screen-sky .stars__dot").length,
    stages: document.querySelectorAll(".hud__seg").length,
    hud: document.querySelector(".hud__score")?.textContent,
  };
});

console.log(`${which}: normal mode -> ${JSON.stringify(normal)}`);
console.log(`${which}: console mode -> ${JSON.stringify(consoleMode)}`);
console.log(`${which}: problems -> ${problems.length ? problems.join(" | ") : "none"}`);

await page.screenshot({ path: `.probe-${which}.png` });
await browser.close();
process.exit(problems.length ? 1 : 0);
