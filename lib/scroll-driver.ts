/**
 * One scroll listener and one rAF loop for the whole page.
 *
 * Cards register themselves only while they are near the viewport (an
 * IntersectionObserver in ItchCard does the gating), so off-screen cards
 * cost nothing — no listener, no measurement. The loop stops entirely when
 * the last card unregisters.
 */

export interface Driven {
  el: HTMLElement;
  apply: (progress: number) => void;
}

const active = new Set<Driven>();
let frame = 0;

/**
 * 0 while the card sits low in the viewport, 1 once it has risen into place.
 * The window is deliberately wide — 73% of viewport height — because the
 * complaint has to stay readable for someone scrolling at a normal pace, and
 * an earlier, narrower window resolved it before most readers got to it.
 */
const START = 0.85; // card top near the bottom of the viewport
const END = 0.12; // card top near the top of it

function tick() {
  frame = 0;
  const vh = window.innerHeight;
  const span = (START - END) * vh;

  for (const target of active) {
    const top = target.el.getBoundingClientRect().top;
    const raw = (START * vh - top) / span;
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
