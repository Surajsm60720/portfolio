/**
 * Physical controller support, normalised across layouts.
 *
 * The Gamepad API reports a `mapping` of "standard" for pads the browser
 * recognises, where button and axis indices are fixed. Plenty of pads report
 * an empty mapping instead — older PlayStation pads, third-party and arcade
 * controllers, anything behind an adapter — and then the indices mean
 * whatever the manufacturer decided.
 *
 * So nothing here trusts a single index. Direction is read from the standard
 * d-pad buttons, from either analogue stick, and from a hat axis, and
 * whichever speaks first wins. Confirm accepts any of the four face buttons
 * rather than insisting on button 0, because "the bottom one" is not a
 * portable idea across layouts.
 *
 * Polling only runs while at least one pad is connected, and the loop stops
 * when the last one disconnects.
 */
export type Pad = "up" | "down" | "left" | "right" | "confirm" | "back";

const DEADZONE = 0.55;
/** Repeat rate while a direction is held, in milliseconds. */
const REPEAT = 260;

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

function read(pad: Gamepad): Pad | null {
  const buttons = pad.buttons;

  for (const [index, dir] of Object.entries(DPAD)) {
    if (buttons[Number(index)]?.pressed) return dir;
  }
  /* Any face button confirms. Which one is "A" depends on the layout, and
     on whether the owner grew up with Nintendo. */
  for (let i = 0; i <= 3; i += 1) {
    if (buttons[i]?.pressed) return i === 1 ? "back" : "confirm";
  }
  /* Start or Select back out, at their usual indices when they exist. */
  if (buttons[8]?.pressed || buttons[9]?.pressed) return "back";

  return fromAxes(pad.axes) ?? fromHat(pad.axes);
}

export interface GamepadWatch {
  /** Fired on a fresh press, and again on repeat while held. */
  onInput: (input: Pad) => void;
  /** Fired when a pad first appears, with whatever id it reports. */
  onConnect?: (id: string) => void;
  onDisconnect?: () => void;
}

export function watchGamepads(watch: GamepadWatch): () => void {
  if (typeof navigator === "undefined" || !navigator.getGamepads) {
    return () => {};
  }

  let frame = 0;
  let last: Pad | null = null;
  let lastAt = 0;
  let connected = 0;

  const tick = () => {
    frame = requestAnimationFrame(tick);
    const pads = navigator.getGamepads();
    let current: Pad | null = null;

    for (const pad of pads) {
      if (!pad) continue;
      current = read(pad);
      if (current) break;
    }

    const now = performance.now();
    if (!current) {
      last = null;
      return;
    }
    if (current !== last || now - lastAt >= REPEAT) {
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
  for (const pad of navigator.getGamepads()) {
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
