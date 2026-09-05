"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import NightSky from "./NightSky";
import { skyLines } from "@/lib/content";
import { cycleTheme } from "@/lib/theme";

import { watchKonami } from "@/lib/konami";
import { watchGamepads, type Pad } from "@/lib/gamepad";
import {
  getConsoleServerSnapshot,
  getConsoleSnapshot,
  goToScreen,
  goToSection,
  setConsole,
  subscribeConsole,
  toggleConsole,
  wideEnough,
} from "@/lib/console-mode";

/**
 * A four-way pad, drawn as pixel art in SVG rather than shipped as an image
 * — theme-aware, crisp at any size, one request fewer.
 *
 * It never binds the arrow keys globally. Overriding them would break the
 * browser's own scrolling for every keyboard user, which costs far more than
 * this control is worth. The pad is a focusable group and arrows drive it
 * only while focus is inside it.
 *
 * Left and right are placeholders. Change ACTIONS and nothing else moves.
 */
type Dir = "up" | "down" | "left" | "right";
type Face = "a" | "b" | "start" | "select";
type Input = Dir | Face;

const ACTIONS: Record<Input, string> = {
  up: "Previous stage",
  down: "Next stage",
  left: "Page up",
  right: "Page down",
  a: "Warp to the top",
  b: "Power off",
  start: "Contact",
  select: "Toggle theme",
};

/** Every landmark the pad can move between, in document order. */
/* A three-step triangle on a 12x12 grid, pointing up. An earlier version put
   a stem under the head; at the size these keys actually render, the stem was
   nearly as wide as the head and the whole glyph read as a plus sign. A bare
   triangle is unmistakable at any size, which is why every real d-pad uses
   one. The other three directions are this shape rotated in CSS.
   [x, y, width, height] */
const ARROW: [number, number, number, number][] = [
  [5, 2, 2, 3],
  [3, 5, 6, 3],
  [1, 8, 10, 3],
];

export default function DPad() {
  const {
    on: consoleOn,
    phase,
    at,
    total,
    where,
  } = useSyncExternalStore(
    subscribeConsole,
    getConsoleSnapshot,
    getConsoleServerSnapshot,
  );
  const [skyOpen, setSkyOpen] = useState(false);
  const [skyLine, setSkyLine] = useState(skyLines[0]);
  const [hint, setHint] = useState<Input | null>(null);
  const [pad, setPad] = useState<string | null>(null);
  /* A transient screen message, so nothing about this fails silently. */
  const [flash, setFlash] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  /* A transient message on the screen, so nothing here fails in silence. */
  const say = useCallback((message: string) => {
    setFlash(message);
    timers.current.push(window.setTimeout(() => setFlash(null), 2200));
  }, []);

  useEffect(() => {
    const off = watchKonami(() => {
      if (!wideEnough()) {
        /* Silence here would be indistinguishable from a broken feature. */
        say("NEEDS A WIDER WINDOW");
        return;
      }
      toggleConsole();
    });
    return off;
  }, [say]);

  /* The breadcrumb. An easter egg with no trace at all cannot be told apart
     from something that does not work, and the browser console is where
     this particular audience already looks. */
  useEffect(() => {
    console.log(
      "%c SM · 01 %c  ↑ ↑ ↓ ↓ ← → ← → B A  %c or plug in a controller",
      "background:#0b1a12;color:#5cf2a0;font-family:monospace;padding:3px 6px",
      "font-family:monospace;letter-spacing:.14em",
      "font-family:monospace;color:#888",
    );
  }, []);

  useEffect(() => {
    if (!consoleOn) return;
    const onResize = () => {
      if (!wideEnough()) setConsole(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConsole(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [consoleOn]);

  const go = useCallback(
    (input: Input) => {
      if (input === "start") {
        setConsole(false);
        return;
      }
      if (input === "select") {
        cycleTheme();
        return;
      }

      const back = input === "up" || input === "b";
      const forward = input === "down" || input === "a";

      /* Going back from the first page keeps going. Up past the top is where
         the sky is, and it is the only thing above screen one. */
      if (back && at === 0) {
        setSkyLine(skyLines[Math.floor(Math.random() * skyLines.length)]);
        setSkyOpen(true);
        return;
      }

      if (back) return goToScreen(at - 1);
      if (forward) return goToScreen(at + 1);
      if (input === "left") return goToSection(-1);
      if (input === "right") return goToSection(1);
    },
    [at],
  );

  /* Arrows work here and only here — focus has to be inside the pad. */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const map: Record<string, Input> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      go(dir);
    },
    [go],
  );

  /* A real controller drives the same four actions the on-screen pad does.
     Connecting one also opens the console — if you have gone to the trouble
     of plugging in a pad, the door should already be open. */
  useEffect(() => {
    let off = () => {};
    try {
      off = watchGamepads({
        onConnect: (id) => {
          setPad(
            id
              .replace(/\s*\([^)]*\)\s*/g, "")
              .trim()
              .slice(0, 22) || "controller",
          );
          if (wideEnough()) setConsole(true);
          else say("NEEDS A WIDER WINDOW");
        },
        onDisconnect: () => setPad(null),
        onInput: (input: Pad) => {
          if (input === "back") {
            setConsole(false);
            return;
          }
          if (input === "confirm") return;
          go(input);
        },
      });
    } catch {
      /* Controller support is a bonus; the on-screen pad is the product. */
    }
    return off;
  }, [go, say]);

  const key = (dir: Dir) => (
    <button
      type="button"
      className={`dpad__key dpad__key--${dir}`}
      onClick={() => go(dir)}
      onPointerEnter={() => setHint(dir)}
      onPointerLeave={() => setHint(null)}
      onFocus={() => setHint(dir)}
      onBlur={() => setHint(null)}
      aria-label={ACTIONS[dir]}
    >
      <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
        {ARROW.map(([x, y, w, h]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="currentColor"
            shapeRendering="crispEdges"
          />
        ))}
      </svg>
    </button>
  );

  /* The handheld exists only while the page is inside it. Its listeners —
     the Konami code, the controller poll — run either way, above. */
  const face = (input: Face, label: string) => (
    <button
      type="button"
      className={`face face--${input}`}
      onClick={() => go(input)}
      onPointerEnter={() => setHint(input)}
      onPointerLeave={() => setHint(null)}
      onFocus={() => setHint(input)}
      onBlur={() => setHint(null)}
      aria-label={ACTIONS[input]}
    >
      {label}
    </button>
  );

  return (
    <>
      {/* The power-on flash. Present only while the mode is changing. */}
      {phase === "opening" || phase === "closing" ? (
        <div className="boot" data-phase={phase} aria-hidden="true" />
      ) : null}

      {consoleOn || phase === "closing" ? (
        <div className="shell">
          {/* The strip above the screen. A stage number and a name is how a
              game tells you where you are, and it is more useful here than a
              breadcrumb would be. */}
          <div className="shell__hud">
            <span className="hud__stage">
              STAGE {String(at + 1).padStart(2, "0")}/
              {String(total).padStart(2, "0")}
            </span>
            <span className="hud__name">
              {flash ?? (hint ? ACTIONS[hint] : where || "\u2014")}
            </span>
            <span className="hud__pad">{pad ?? "1P"}</span>
            <span className="hud__bar" aria-hidden="true">
              {Array.from({ length: total }, (_, n) => (
                <span className="hud__seg" key={n} data-on={n <= at} />
              ))}
            </span>
            <span className="console__sr" aria-live="polite">
              {hint ? ACTIONS[hint] : where ? `At ${where}` : ""}
            </span>
          </div>

          {/* The screen itself is .page; this only lays scanlines over it. */}
          <div className="shell__glass" aria-hidden="true" />

          <div className="shell__deck">
            <div
              className="dpad"
              role="group"
              aria-label="Stage navigation"
              onKeyDown={onKeyDown}
            >
              {key("up")}
              {key("left")}
              <span className="dpad__hub" aria-hidden="true" />
              {key("right")}
              {key("down")}
            </div>

            <div className="shell__middle">
              <p className="console__mark" aria-hidden="true">
                SM&nbsp;·&nbsp;01
              </p>
              <div className="shell__system">
                {face("select", "SELECT")}
                {face("start", "START")}
              </div>
            </div>

            <div className="shell__face">
              {face("b", "B")}
              {face("a", "A")}
            </div>
          </div>
        </div>
      ) : null}

      <NightSky
        open={skyOpen}
        line={skyLine}
        onClose={() => setSkyOpen(false)}
      />
    </>
  );
}
