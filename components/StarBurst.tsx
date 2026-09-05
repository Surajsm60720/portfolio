"use client";

/**
 * The flourish on the way back to the top. Pixel stars, drawn as hard-edged
 * squares rather than points, so it reads as sprite work and not as a
 * particle system.
 *
 * Positions are generated when the burst fires, never during render, so
 * there is no hydration mismatch to suppress. The overlay is inert and
 * removed as soon as it finishes.
 */
export interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  drift: number;
}

export function makeStars(count = 44): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() < 0.25 ? 4 : Math.random() < 0.6 ? 3 : 2,
    delay: Math.random() * 260,
    drift: 40 + Math.random() * 90,
  }));
}

export default function StarBurst({ stars }: { stars: Star[] }) {
  if (!stars.length) return null;
  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className="stars__px"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}ms`,
              "--drift": `${s.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
