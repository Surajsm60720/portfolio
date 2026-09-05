"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  getConsoleServerSnapshot,
  getConsoleSnapshot,
  subscribeConsole,
  toggleConsole,
  wideEnough,
} from "@/lib/console-mode";

/**
 * The way into console mode for people who do not know the Konami code.
 *
 * It lives in the footer's fine print rather than the top rail. In the rail
 * it was the second thing anyone saw, which is the wrong weight entirely —
 * this is a thing to come across after reading the whole page, not an offer
 * made at the door. It hides below 900px, where the mode cannot run.
 */
export default function ConsoleLink() {
  const { on } = useSyncExternalStore(
    subscribeConsole,
    getConsoleSnapshot,
    getConsoleServerSnapshot,
  );
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!wide) return null;

  return (
    <button
      type="button"
      className="foot__play"
      onClick={() => wideEnough() && toggleConsole()}
      aria-pressed={on}
    >
      {on ? "Leave console mode" : "Play this page"}
    </button>
  );
}
