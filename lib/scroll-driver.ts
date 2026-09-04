/**
 * One scroll listener and one rAF loop for the whole page.
 *
 * Cards register themselves only while they are near the viewport (an
 * IntersectionObserver in ItchCard does the gating), so off-screen cards
 * cost nothing — no listener, no measurement. The loop stops entirely when
 * the last card unregisters.
 */

export interface Driven {
  /**
   * The element whose position drives progress — the thing being *read*, not
   * the card containing it. Anchoring to the card's top was wrong: the quote
   * is centred in a tall stage, roughly 350px below that top, so it stayed
   * below the fold for its entire full-opacity window and reached zero
   * exactly as it arrived in a comfortable reading position.
   */
  anchor: HTMLElement;
  apply: (progress: number) => void;
}

const active = new Set<Driven>();
let frame = 0;

/**
 * Measured on the anchor's centre, as a fraction of viewport height.
 * 0 as the quote enters from the bottom, 1 once it has risen to the upper
 * third and the build has taken the space.
 */
const START = 0.95; // quote centre entering at the bottom edge
const END = 0.4; // quote centre well up the screen, card comfortably placed

function tick() {
  frame = 0;
  const vh = window.innerHeight;
  const span = (START - END) * vh;

  for (const target of active) {
    const rect = target.anchor.getBoundingClientRect();
    const centre = rect.top + rect.height / 2;
    const raw = (START * vh - centre) / span;
    target.apply(raw < 0 ? 0 : raw > 1 ? 1 : raw);
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(tick);
}

export function register(target: Driven) {
  if (active.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  active.add(target);
  schedule();
}

export function unregister(target: Driven) {
  active.delete(target);
  if (active.size === 0) {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    if (frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  }
}
