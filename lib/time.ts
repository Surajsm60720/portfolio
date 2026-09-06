/**
 * The clock in the top rail runs on Suraj's time, not the visitor's.
 * Someone opening this from London at 21:00 sees night mode because it
 * is 02:30 where he is. That is the point — see spec §6b.
 */

export const TZ = "Asia/Kolkata";

/** Night runs 19:00 to 06:00 IST — where 179 commits of real activity actually
 *  cluster. The previous site guessed 22:00; see lib/commit-hours.json. */
export const NIGHT_FROM = 19;
export const NIGHT_UNTIL = 6;

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/**
 * Ten seconds is plenty for a display that only shows hours and minutes.
 * Both clocks on the site — the top rail's and the console HUD's — share it.
 */
export function subscribeClock(onChange: () => void): () => void {
  const id = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(id);
}

/** "03:14" in IST, regardless of where the visitor is. */
export function istClock(at: Date = new Date()): string {
  return formatter.format(at);
}

export function istHour(at: Date = new Date()): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      hour: "2-digit",
      hour12: false,
    }).format(at),
  );
}

export function isNight(hour: number): boolean {
  return hour >= NIGHT_FROM || hour < NIGHT_UNTIL;
}
