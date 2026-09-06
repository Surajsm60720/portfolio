"use client";

/**
 * The same sky, drawn in two places.
 *
 * The night sky panel above the top of the page and the space the handheld
 * floats in are the same field of stars with two different jobs, so they are
 * the same list rather than two lists that drift apart. Positions are fixed
 * rather than randomised: the same sky every time, and nothing to hydrate.
 *
 * The component only places the dots. Every animation belongs to whatever
 * wraps it — `.sky` streaks them in and holds them, `.deep` drifts them
 * behind the console — because the two entrances are not the same entrance.
 *
 * [x%, y%, lane]. Three lanes so the streaks never arrive as one flat
 * curtain, and so the drift behind the console has depth.
 */
const STARS: [number, number, number][] = [
  [6, 18, 1], [13, 42, 0], [19, 9, 2], [24, 63, 1], [29, 28, 0], [34, 77, 2],
  [38, 15, 1], [43, 51, 0], [47, 34, 2], [52, 71, 1], [56, 12, 0], [61, 45, 2],
  [66, 24, 1], [70, 84, 0], [74, 38, 2], [79, 17, 1], [83, 59, 0], [88, 30, 2],
  [92, 73, 1], [95, 21, 0], [9, 66, 2], [16, 88, 1], [27, 5, 0], [41, 92, 2],
  [58, 88, 1], [72, 60, 0], [86, 8, 2], [98, 48, 1], [3, 37, 0], [50, 6, 2],
  [11, 26, 1], [36, 40, 2], [64, 70, 0], [81, 44, 1], [90, 90, 2], [21, 54, 0],
];

/** Diagonal streaks on long, uneven intervals — rare enough to be a moment. */
const SHOOTERS: [top: number, left: number, delay: number, dur: number][] = [
  [12, 8, 2.4, 11],
  [46, 62, 9.1, 14],
  [72, 26, 17.6, 12],
];

/**
 * The list, repeated and shifted.
 *
 * One pass is enough for the night sky, which owns the whole viewport. The
 * console covers most of its own, leaving only the margins to see stars in,
 * and one pass out there is a handful of dots and a lot of black. Coprime
 * shifts rather than a second list: denser where it needs to be, still the
 * same sky, still nothing to hydrate.
 */
function field(passes: number) {
  const out: [number, number, number, number][] = [];
  for (let pass = 0; pass < passes; pass += 1) {
    STARS.forEach(([x, y, lane], i) => {
      out.push([
        (x + pass * 37) % 100,
        (y + pass * 29) % 100,
        (lane + pass) % 3,
        pass * STARS.length + i,
      ]);
    });
  }
  return out;
}

export default function Starfield({
  variant,
  shooting = false,
}: {
  /** Which set of animations wraps these dots. */
  variant: "sky" | "deep";
  /** Occasional streaks across the field. Only the deep sky earns them. */
  shooting?: boolean;
}) {
  return (
    <div className={`stars stars--${variant}`} aria-hidden="true">
      {field(variant === "deep" ? 3 : 1).map(([x, y, lane, i]) => (
        <span
          key={i}
          className="stars__dot"
          data-lane={lane}
          style={
            {
              left: `${x}%`,
              top: `${y}%`,
              "--d": `${(i % 9) * 55}ms`,
              "--tw": `${(i % 6) * 1.1}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {shooting
        ? SHOOTERS.map(([top, left, delay, dur], i) => (
            <span
              key={`shoot-${i}`}
              className="stars__shot"
              style={
                {
                  top: `${top}%`,
                  left: `${left}%`,
                  "--delay": `${delay}s`,
                  "--dur": `${dur}s`,
                } as React.CSSProperties
              }
            />
          ))
        : null}
    </div>
  );
}
