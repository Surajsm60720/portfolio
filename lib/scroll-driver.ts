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

/** 0 while the card sits low in the viewport, 1 once it has risen into place. */
const START = 0.72; // card top at 72% of viewport height
const END = 0.2; // card top at 20% of viewport height

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
