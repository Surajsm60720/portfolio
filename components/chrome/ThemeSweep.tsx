/**
 * The theme transition — one fixed element carrying a warm gradient edge
 * across the viewport. The palette swaps behind it mid-sweep so the new
 * theme looks like it was always there.
 *
 * Transform and opacity only; the animation itself lives in globals.css
 * (`.sweep`). Hidden entirely under prefers-reduced-motion.
 */
export default function ThemeSweep({ running }: { running: boolean }) {
  return <div className="sweep" data-running={running} aria-hidden="true" />;
}
