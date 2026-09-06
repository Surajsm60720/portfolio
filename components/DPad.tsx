"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Starfield from "./Starfield";
import { cycleTheme } from "@/lib/theme";
import {
  closeSky,
  getSkyServerSnapshot,
  getSkySnapshot,
  openSky,
  subscribeSky,
} from "@/lib/sky";
import { istClock, subscribeClock } from "@/lib/time";

import { watchKonami } from "@/lib/konami";
import { watchGamepads, type Pad } from "@/lib/gamepad";
import {
  cancelPick,
  confirmPick,
  getConsoleServerSnapshot,
  getConsoleSnapshot,
  moveDown,
  moveUp,
  setConsole,
  subscribeConsole,
  toggleConsole,
  wideEnough,
} from "@/lib/console-mode";

/**
 * A four-way pad, drawn as pixel art in SVG rather than shipped as an image
 * — theme-aware, crisp at any size, one request fewer.
 *
 * It is a menu cursor. All four directions walk the links and buttons of the
 * page on screen and step to the next or previous page when they run out —
 * up and left go back, down and right go on. A takes whatever is selected
 * and B puts it back.
 *
 * The arrow keys are bound globally, but only while console mode is on. The
 * objection to binding them — that it takes the browser's own scrolling away
 * from every keyboard user — does not apply here: <html> is overflow:hidden
 * in this mode and the page is one screen at a time, so there is no scrolling
 * to take. Outside console mode nothing here listens for them at all.
 */
type Dir = "up" | "down" | "left" | "right";
type Face = "a" | "b" | "start" | "select";
type Input = Dir | Face;

const ACTIONS: Record<Input, string> = {
  up: "Previous item",
  left: "Previous item",
  down: "Next item",
  right: "Next item",
  a: "Select",
  b: "Back",
  start: "Power off",
  select: "Toggle theme",
};

/** The deck's manual, in the order a thumb finds them. */
const LEGEND: [keys: string, what: string][] = [
  ["\u2191\u2193\u2190\u2192", "MOVE"],
  ["A", "SELECT"],
  ["B", "BACK"],
];

/** The keyboard's half of the pad, live only inside console mode. */
const KEYS: Record<string, Dir> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
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
    found,
    score,
    areas,
    visited,
    award,
    pick,
    picks,
    pickName,
  } = useSyncExternalStore(
    subscribeConsole,
    getConsoleSnapshot,
    getConsoleServerSnapshot,
  );
  /* The rail — and its clock — is gone in console mode, so the HUD carries
     it. Same source as the rail's, so the two can never disagree. */
  const clock = useSyncExternalStore(subscribeClock, istClock, () => null);
  /* The sky is a page-level thing with two ways in — see lib/sky.ts. The pad
     only needs to know whether it is up, so the deck can bring you down. */
  const { open: skyOpen } = useSyncExternalStore(
    subscribeSky,
    getSkySnapshot,
    getSkyServerSnapshot,
  );
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

  const go = useCallback(
    (input: Input) => {
      /* In console mode the sky is on the screen rather than over the
         window, so the deck is still under your thumbs while it is up.
         Anything on the pad comes back down from it — except the two that
         mean "up", which would otherwise toggle the sky on every second
         press of a key held to go up. There is nothing above the top. */
      if (skyOpen) {
        if (input !== "up" && input !== "left") closeSky();
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

      if (input === "down" || input === "right") return moveDown();
      if (input === "a") return confirmPick();

      /* Going back runs out eventually. Above the first item of the first
         page is the sky, and it is the only thing up there. */
      const moved = input === "b" ? cancelPick() : moveUp();
      if (!moved) openSky();
    },
    [skyOpen],
  );

  /* The pad's other half. Live only while the console is on, so outside it
     the arrow keys still belong to the browser. */
  useEffect(() => {
    if (!consoleOn) return;
    const onResize = () => {
      if (!wideEnough()) setConsole(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        /* The sky has its own Escape. Without this guard one press closed
           the sky and powered the console off behind it. */
        if (!skyOpen) setConsole(false);
        return;
      }
      const dir = KEYS[e.key];
      if (!dir) return;
      /* Nothing scrolls in this mode, so nothing is taken away by this.
         Enter is deliberately not bound: the cursor gives the selected item
         real focus, so the browser already activates it. */
      e.preventDefault();
      go(dir);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [consoleOn, skyOpen, go]);

  /* What the controller callbacks need, without their effect depending on
     it. The subscription must be made once and left alone: re-running it
     re-detects the pads already plugged in, and that fires onConnect again —
     which turns the console back on. Anything keyed to `on` in the deps
     would make the console impossible to leave with a pad connected. */
  const live = useRef({ on: consoleOn, go });
  useEffect(() => {
    live.current = { on: consoleOn, go };
  }, [consoleOn, go]);

  /* A real controller drives the whole deck, not a reduced version of it.
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
          /* The pad drives the console and nothing else. With one connected
             and the console off, up used to open the night sky over the
             ordinary page — the pad was steering a menu that was not there.
             START is the exception, because it is the way back in. */
          if (!live.current.on) {
            if (input === "start" && wideEnough()) setConsole(true);
            return;
          }
          live.current.go(input);
        },
      });
    } catch {
      /* Controller support is a bonus; the on-screen pad is the product. */
    }
    return off;
  }, [say]);

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

            {/* What the cursor is on, out of what is on this page. Dim
                while nothing is selected, so the count still says how much
                there is to reach. */}
            <span className="hud__pick" data-on={pick >= 0 || undefined}>
              <b aria-hidden="true" />
              {pick >= 0 ? String(pick + 1).padStart(2, "0") : "--"}/
              {String(picks).padStart(2, "0")}
            </span>

            <span className="hud__name">
              {flash ?? (hint ? ACTIONS[hint] : pickName || where || "\u2014")}
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

            {/* The selected item announces itself through focus, so this
                only carries what focus cannot: which page you are on. */}
            <span className="console__sr" aria-live="polite">
              {hint ? ACTIONS[hint] : where ? `At ${where}` : ""}
            </span>
          </div>

          {/* The hole the screen sits in. The screen itself is .page, a
              sibling of the housing — see .screen-fx below — so this is what
              is behind it while the CRT is folding open or shut. */}
          <div className="shell__well" aria-hidden="true" />

          <div className="shell__deck">
            <div className="dpad" role="group" aria-label="Menu cursor">
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
    </>
  );
}
