"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import NightSky from "./NightSky";
import Starfield from "./Starfield";
import { skyLines } from "@/lib/content";
import { cycleTheme } from "@/lib/theme";
import { istClock, subscribeClock } from "@/lib/time";

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
  left: "Previous area",
  right: "Next area",
  a: "Advance",
  b: "Back",
  start: "Power off",
  select: "Toggle theme",
};

/** The deck's manual, in the order a thumb finds them. */
const LEGEND: [keys: string, what: string][] = [
  ["\u2191\u2193", "STAGE"],
  ["\u2190\u2192", "AREA"],
  ["A", "NEXT"],
  ["B", "BACK"],
];

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
    found,
    score,
    areas,
    visited,
    award,
  } = useSyncExternalStore(
    subscribeConsole,
    getConsoleSnapshot,
    getConsoleServerSnapshot,
  );
  /* The rail — and its clock — is gone in console mode, so the HUD carries
     it. Same source as the rail's, so the two can never disagree. */
  const clock = useSyncExternalStore(subscribeClock, istClock, () => null);
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
      /* The sky has its own Escape. Without this guard one press closed the
         sky and powered the console off behind it. */
      if (e.key === "Escape" && !skyOpen) setConsole(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [consoleOn, skyOpen]);

  const go = useCallback(
    (input: Input) => {
      /* In console mode the sky is on the screen rather than over the
         window, so the deck is still under your thumbs while it is up.
         Anything on the pad comes back down from it. */
      if (skyOpen) {
        setSkyOpen(false);
        return;
      }

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
    [at, skyOpen],
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

  /* Areas are the sections the pages came from; the HUD counts them the way
     a game counts worlds. */
  const area = areas[at] ?? 0;
  /* World 1-3: the area, then how far into it you are. The classic notation,
     and it says more in six characters than a page number out of twenty. */
  const stage = at - areas.indexOf(area) + 1;
  const cleared = total > 0 && found === total;

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
              breadcrumb would be. The rest is the run: what has been found,
              what that scored, and how much of the map is left. */}
          <div className="shell__hud" data-clear={cleared || undefined}>
            <span className="hud__player">1P</span>

            <span className="hud__score">
              <b>SCORE</b>
              <em>{String(score).padStart(6, "0")}</em>
            </span>

            <span className="hud__found">
              <i aria-hidden="true" />
              {String(found).padStart(2, "0")}/{String(total).padStart(2, "0")}
            </span>

            <span className="hud__name">
              {flash ?? (hint ? ACTIONS[hint] : where || "\u2014")}
            </span>

            <span className="hud__world">
              <small>WORLD</small>
              {area + 1}-{stage}
            </span>
            <span className="hud__clock">
              <small>BLR</small>
              {clock ?? "--:--"}
            </span>
            {/* What is driving this. "1P" is already the badge on the left,
                so the fallback says the honest thing instead. */}
            <span className="hud__pad">{pad ?? "KEYS"}</span>

            {/* The map. One tick per page, grouped into areas, so how much
                is left is a shape rather than a fraction. */}
            <span className="hud__map" aria-hidden="true">
              {areas.map((of, n) => (
                <span
                  className="hud__seg"
                  key={n}
                  data-edge={n > 0 && areas[n - 1] !== of ? "start" : undefined}
                  data-state={
                    n === at ? "here" : visited[n] ? "seen" : "new"
                  }
                />
              ))}
            </span>

            <span className="console__sr" aria-live="polite">
              {hint ? ACTIONS[hint] : where ? `At ${where}` : ""}
            </span>
          </div>

          {/* The hole the screen sits in. The screen itself is .page, a
              sibling of the housing — see .screen-fx below — so this is what
              is behind it while the CRT is folding open or shut. */}
          <div className="shell__well" aria-hidden="true" />

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
              {/* The card that used to come in the box. */}
              <ul className="legend" aria-hidden="true">
                {LEGEND.map(([keys, what]) => (
                  <li key={keys}>
                    <b>{keys}</b>
                    {what}
                  </li>
                ))}
              </ul>
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

      {/* What the screen is showing behind everything else: the same sky
          that lives above the top of the document. Pressing up at the start
          goes there; console mode simply never leaves. A sibling of .page
          rather than something inside it, because the screen scrolls and
          the sky must not. */}
      {consoleOn || phase === "closing" ? (
        <div className="screen-sky" aria-hidden="true">
          <Starfield variant="deep" shooting />
        </div>
      ) : null}

      {/* Everything that belongs over the screen.
          Not inside .shell: the housing carries a drop-shadow filter, which
          makes a stacking context, and nothing inside it can rise above the
          screen — which is the housing's sibling and painted after it. This
          overlay is that sibling too, one layer higher, and never takes a
          pointer event. */}
      {consoleOn || phase === "closing" ? (
        <div className="screen-fx" aria-hidden="true">
          <div className="screen-fx__glass" />

          {/* Each award floats off once. Keyed on the award so a new one
              restarts the float rather than inheriting the last one's. */}
          {award ? (
            <span className="screen-fx__pop" key={`pop-${award.id}`}>
              +{award.points}
            </span>
          ) : null}

          {/* Arriving somewhere is announced, the way a level is. Keyed on
              the area name, so it plays on entering one and never again
              while you move around inside it. */}
          {where ? (
            <p className="screen-fx__card" key={`card-${where}`}>
              <small>AREA {area + 1}</small>
              {where}
            </p>
          ) : null}

          {/* Only the awards worth stopping for get the big text. */}
          {award?.label ? (
            <p className="screen-fx__fanfare" key={`fan-${award.id}`}>
              {award.label}
            </p>
          ) : null}
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
