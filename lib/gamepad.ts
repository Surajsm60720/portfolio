/**
 * Physical controller support, normalised across layouts.
 *
 * The Gamepad API reports a `mapping` of "standard" for pads the browser
 * recognises, where button and axis indices are fixed. Plenty of pads report
 * an empty mapping instead — older PlayStation pads, third-party and arcade
 * controllers, anything behind an adapter — and then the indices mean
 * whatever the manufacturer decided.
 *
 * So nothing here trusts a single index for direction. It is read from the
 * standard d-pad buttons, from either analogue stick, and from a hat axis,
 * and whichever speaks first wins.
 *
 * The face buttons are read exactly where the standard puts them, because
 * the on-screen deck has four distinctly labelled controls now and there is
 * no way to honour A, B, SELECT and START by guessing. A pad that reports no
 * mapping gets a forgiving fallback instead of nothing.
 *
 * Polling only runs while at least one pad is connected, and the loop stops
 * when the last one disconnects.
 */
export type Pad =
  | "up"
  | "down"
  | "left"
  | "right"
  | "a"
  | "b"
  | "start"
  | "select";

const DEADZONE = 0.55;
/** Repeat rate while a direction is held, in milliseconds. */
const REPEAT = 260;

/* Only the directions repeat. A held SELECT cycling the theme four times a
   second, or a held START powering the console on and off, is not a feature
   anybody asked for. */
const REPEATS = new Set<Pad>(["up", "down", "left", "right"]);

/** Standard-mapping d-pad indices. Checked first, never relied on alone. */
const DPAD = { 12: "up", 13: "down", 14: "left", 15: "right" } as const;

function fromAxes(axes: readonly number[]): Pad | null {
  /* Both sticks. Vertical wins ties because the page is a vertical thing. */
  for (const [xi, yi] of [
    [0, 1],
    [2, 3],
  ]) {
    const y = axes[yi] ?? 0;
    const x = axes[xi] ?? 0;
    if (y <= -DEADZONE) return "up";
    if (y >= DEADZONE) return "down";
    if (x <= -DEADZONE) return "left";
    if (x >= DEADZONE) return "right";
  }
  return null;
}

/**
 * Some non-standard pads expose the d-pad as a single "hat" axis holding
 * eight discrete positions between -1 and 1 rather than as four buttons.
 */
function fromHat(axes: readonly number[]): Pad | null {
  if (axes.length < 5) return null;
  const v = axes[axes.length - 1];
  if (v === undefined || Math.abs(v) > 1.2) return null;
  const near = (target: number) => Math.abs(v - target) < 0.12;
  if (near(-1)) return "up";
  if (near(-0.43) || near(1)) return "right";
  if (near(0.14)) return "down";
  if (near(0.71)) return "left";
  return null;
}

/**
 * The four labelled controls, at the indices the standard mapping fixes:
 * 0 is the bottom face button, 1 the right one, 8 Select and 9 Start. Every
 * layout the browser calls "standard" agrees on these, whatever the buttons
 * are printed with — Xbox A/B, PlayStation cross/circle, Nintendo B/A.
 */
function fromFace(pad: Gamepad): Pad | null {
  const b = pad.buttons;
  if (b[0]?.pressed) return "a";
  if (b[1]?.pressed) return "b";
  if (b[8]?.pressed) return "select";
  if (b[9]?.pressed) return "start";

  /* A pad reporting no mapping put its buttons wherever it liked, and the
     other two face positions do nothing on a standard one — so treating
     them as A costs nothing here and gives a shifted layout a way in. */
  if (pad.mapping !== "standard" && (b[2]?.pressed || b[3]?.pressed)) return "a";
  return null;
}

function read(pad: Gamepad): Pad | null {
  for (const [index, dir] of Object.entries(DPAD)) {
    if (pad.buttons[Number(index)]?.pressed) return dir;
  }
  return fromFace(pad) ?? fromAxes(pad.axes) ?? fromHat(pad.axes);
}

export interface GamepadWatch {
  /** Fired on a fresh press, and again on repeat while held. */
  onInput: (input: Pad) => void;
  /** Fired when a pad first appears, with whatever id it reports. */
  onConnect?: (id: string) => void;
  onDisconnect?: () => void;
}

/**
 * WebKit returns a `GamepadList` from getGamepads() — array-like, but not
 * iterable. `for...of` over it throws a TypeError, and this runs inside an
 * effect on mount for every visitor, so in Safari that throw happened during
 * the commit phase and took the whole component down. The control simply did
 * not exist there, while every other browser was fine.
 *
 * Array.from copes with both shapes. The try/catch is belt to that brace:
 * nothing about optional controller support should ever be able to remove a
 * control that works without one.
 */
function pads(): (Gamepad | null)[] {
  try {
    return Array.from(navigator.getGamepads() ?? []);
  } catch {
    return [];
  }
}

export function watchGamepads(watch: GamepadWatch): () => void {
  if (typeof navigator === "undefined" || typeof navigator.getGamepads !== "function") {
    return () => {};
  }

  let frame = 0;
  let last: Pad | null = null;
  let lastAt = 0;
  let connected = 0;

  const tick = () => {
    frame = requestAnimationFrame(tick);
    let current: Pad | null = null;

    for (const pad of pads()) {
      if (!pad) continue;
      try {
        current = read(pad);
      } catch {
        current = null;
      }
      if (current) break;
    }

    const now = performance.now();
    if (!current) {
      last = null;
      return;
    }
    if (current !== last || (REPEATS.has(current) && now - lastAt >= REPEAT)) {
      last = current;
      lastAt = now;
      watch.onInput(current);
    }
  };

  const start = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const onConnected = (e: Event) => {
    connected += 1;
    watch.onConnect?.((e as GamepadEvent).gamepad.id);
    start();
  };
  const onDisconnected = () => {
    connected = Math.max(0, connected - 1);
    if (connected === 0) {
      stop();
      watch.onDisconnect?.();
    }
  };

  window.addEventListener("gamepadconnected", onConnected);
  window.addEventListener("gamepaddisconnected", onDisconnected);

  /* A pad already held before this mounted will not fire connected again,
     so check once for one that is present but silent. */
  for (const pad of pads()) {
    if (pad) {
      connected += 1;
      watch.onConnect?.(pad.id);
    }
  }
  if (connected) start();

  return () => {
    stop();
    window.removeEventListener("gamepadconnected", onConnected);
    window.removeEventListener("gamepaddisconnected", onDisconnected);
  };
}
