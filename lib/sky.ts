/**
 * Whether the night sky is up.
 *
 * A module store rather than component state, because there are two ways in
 * now and they are nowhere near each other in the tree: the pad's up button
 * in console mode, and pulling the ordinary page up past its own top.
 *
 * The line is chosen when the sky opens — an event — and never during a
 * render. Picking a random one while rendering would give the server a
 * different line from the client and fail hydration; picking it in an effect
 * would set state from an effect body for no reason.
 */
import { skyLines } from "./content";

export type SkyState = {
  open: boolean;
  /** The one line the sky shows. Stable until it is opened again. */
  line: string;
};

const SHUT: SkyState = { open: false, line: skyLines[0] };

let current: SkyState = SHUT;
const listeners = new Set<() => void>();

function publish(next: SkyState) {
  current = next;
  for (const listener of listeners) listener();
}

export function openSky(): void {
  if (current.open) return;
  publish({
    open: true,
    line: skyLines[Math.floor(Math.random() * skyLines.length)],
  });
}

export function closeSky(): void {
  if (!current.open) return;
  /* The line stays put on the way out. Swapping it as the panel fades
     rewrites the sentence in front of whoever is still reading it. */
  publish({ ...current, open: false });
}

export function subscribeSky(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export function getSkySnapshot(): SkyState {
  return current;
}

export function getSkyServerSnapshot(): SkyState {
  return SHUT;
}
