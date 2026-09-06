"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { openSky } from "@/lib/sky";
import {
  getConsoleServerSnapshot,
  getConsoleSnapshot,
  subscribeConsole,
} from "@/lib/console-mode";

/**
 * The two ends of the first screen, said out loud.
 *
 * Down is the ordinary thing the page wants you to do, and saying so is
 * worth more than a bare chevron. Up is the part nobody would find: the
 * night sky above the top of the document has been reachable from the pad
 * for a while and from the page not at all, so it was an easter egg with no
 * egg. Now the page says it is there and answers the gesture.
 *
 * Both are buttons before they are hints. Pulling up past the top is a
 * mouse-and-trackpad idea and a touch idea, and neither is available to
 * someone on a keyboard.
 */

/** Wheel distance, in pixels, that counts as pulling up past the top. */
const PULL = 180;
/** Finger travel for the same gesture. Shorter — a drag is deliberate. */
const PULL_TOUCH = 110;
/**
 * A gap this long means the wheel events that follow are a new gesture
 * rather than the tail of the last one. Without it, flicking up the page
 * arrives at the top with momentum still firing upward wheel events, and
 * the sky opens on its own every time you scroll back to the beginning.
 */
const GESTURE_GAP = 160;

export default function ScrollCues() {
  /* Console mode has its own way up — the pad — and its own screen. These
     belong to the ordinary page. */
  const { on: consoleOn } = useSyncExternalStore(
    subscribeConsole,
    getConsoleSnapshot,
    getConsoleServerSnapshot,
  );

  useEffect(() => {
    if (consoleOn) return;

    let pull = 0;
    let lastWheel = 0;
    /* Whether the gesture in progress began with the page already at rest
       at the top. A gesture that started further down never qualifies, and
       that is what keeps momentum from triggering this. */
    let fromTop = false;

    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (now - lastWheel > GESTURE_GAP) {
        fromTop = window.scrollY === 0;
        pull = 0;
      }
      lastWheel = now;

      if (!fromTop || window.scrollY > 0 || e.deltaY >= 0) return;
      pull -= e.deltaY;
      if (pull < PULL) return;
      pull = 0;
      fromTop = false;
      openSky();
    };

    let touchAt = 0;
    let touchFromTop = false;

    const onTouchStart = (e: TouchEvent) => {
      touchAt = e.touches[0]?.clientY ?? 0;
      touchFromTop = window.scrollY === 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchFromTop || window.scrollY > 0) return;
      const y = e.touches[0]?.clientY ?? 0;
      if (y - touchAt < PULL_TOUCH) return;
      touchFromTop = false;
      openSky();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [consoleOn]);

  return null;
}

/** The hint above the fold. Opens the sky for anyone who cannot pull. */
export function SkyCue() {
  return (
    <button type="button" className="cue cue--up" onClick={openSky}>
      <ChevronUp size={13} aria-hidden="true" />
      Scroll up to see the stars
    </button>
  );
}

/** The hint at the foot of the hero. Scrolls, rather than jumping. */
export function DownCue() {
  return (
    <a className="cue cue--down" href="#now">
      Scroll down to know more about me
      <ChevronDown size={13} aria-hidden="true" />
    </a>
  );
}
