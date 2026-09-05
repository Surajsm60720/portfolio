"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NightSky from "./NightSky";
import { skyLines } from "@/lib/content";
import { watchKonami } from "@/lib/konami";
import { watchGamepads, type Pad } from "@/lib/gamepad";

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

const ACTIONS: Record<Dir, string> = {
  up: "Up past the top",
  down: "Next section",
  left: "Previous section",
  right: "Jump to contact",
};

/** Every landmark the pad can move between, in document order. */
function stops(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>(".page section[id], .page footer[id]"),
  );
}

/** The window normally; the page wrapper once it becomes the screen. */
function scroller(): HTMLElement | Window {
  const page = document.querySelector<HTMLElement>(".page");
  const consoleOn = document.documentElement.dataset.console === "on";
  return consoleOn && page ? page : window;
}

function currentIndex(all: HTMLElement[]): number {
  const box = scroller();
  const top = box instanceof Window ? window.scrollY : box.scrollTop;
  const height = box instanceof Window ? window.innerHeight : box.clientHeight;
  const probe = top + height * 0.3;
  let index = 0;
  all.forEach((el, i) => {
    if (el.offsetTop <= probe) index = i;
  });
  return index;
}

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
  const [skyOpen, setSkyOpen] = useState(false);
  const [skyLine, setSkyLine] = useState(skyLines[0]);
  const [hint, setHint] = useState<Dir | null>(null);
  const [at, setAt] = useState(0);
  const [where, setWhere] = useState("");
  const [total, setTotal] = useState(0);
  /* Console mode is an easter egg: no button advertises it. */
  const [console_, setConsole] = useState(false);
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

  /* The screen is what makes this a device rather than an ornament: it
     reports where on the page you currently are, and what a key would do
     while you are considering it. */
  useEffect(() => {
    const read = () => {
      const all = stops();
      const i = currentIndex(all);
      setTotal(all.length);
      setAt(i);
      setWhere((all[i]?.id ?? "").replace(/-/g, " "));
    };
    read();
    const page = document.querySelector<HTMLElement>(".page");
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    page?.addEventListener("scroll", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      page?.removeEventListener("scroll", read);
    };
  }, []);

  /* A device inside a device does not work, so the mode is desktop-only and
     leaves on its own if the window gets too narrow. */
  const wideEnough = useCallback(
    () => window.matchMedia("(min-width: 900px)").matches,
    [],
  );

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
      setConsole((on) => !on);
    });
    return off;
  }, [wideEnough, say]);

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
    document.documentElement.dataset.console = console_ ? "on" : "off";
    return () => {
      delete document.documentElement.dataset.console;
    };
  }, [console_]);

  useEffect(() => {
    if (!console_) return;
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
  }, [console_, wideEnough]);

  const go = useCallback((dir: Dir) => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    const all = stops();

    const box = scroller();

    if (dir === "up") {
      /* Scroll back to the beginning first, then keep going — the sky only
         arrives once there is nowhere left to scroll. The line is chosen
         here, in an event handler, so the panel never picks during render. */
      setSkyLine(skyLines[Math.floor(Math.random() * skyLines.length)]);
      const top = box instanceof Window ? window.scrollY : box.scrollTop;
      if (top < 4) {
        setSkyOpen(true);
        return;
      }
      box.scrollTo({ top: 0, behavior });
      timers.current.push(
        window.setTimeout(() => setSkyOpen(true), reduced ? 60 : 520),
      );
      return;
    }

    if (dir === "right") {
      const end =
        box instanceof Window ? document.body.scrollHeight : box.scrollHeight;
      box.scrollTo({ top: end, behavior });
      return;
    }

    const i = currentIndex(all);
    const next = dir === "down" ? Math.min(i + 1, all.length - 1) : Math.max(i - 1, 0);
    all[next]?.scrollIntoView({ behavior, block: "start" });
  }, []);

  /* Arrows work here and only here — focus has to be inside the pad. */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const map: Record<string, Dir> = {
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
        setPad(id.replace(/\s*\([^)]*\)\s*/g, "").trim().slice(0, 22) || "controller");
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
  }, [go, wideEnough, say]);

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

  return (
    <>
      <div className="console">
        <div className="console__screen">
          <p className="console__row">
            <span className="console__tag">
              {flash ? "!!" : pad ? "P1" : hint ? "GO" : "AT"}
            </span>
            <span className="console__where" data-flash={Boolean(flash)}>
              {flash ?? pad ?? (hint ? ACTIONS[hint] : where || "\u2014")}
            </span>
          </p>

          <p className="console__at" aria-hidden="true">
            {total ? `${at + 1} / ${total}` : ""}
          </p>

          <p className="console__bar" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span className="console__seg" key={i} data-on={i <= at} />
            ))}
          </p>

          <span className="console__sr" aria-live="polite">
            {hint ? ACTIONS[hint] : where ? `At ${where}` : ""}
          </span>
        </div>

        <div
          className="dpad"
          role="group"
          aria-label="Page navigation pad"
          onKeyDown={onKeyDown}
        >
          {key("up")}
          {key("left")}
          <span className="dpad__hub" aria-hidden="true" />
          {key("right")}
          {key("down")}
        </div>

        <p className="console__mark" aria-hidden="true">
          SM&nbsp;·&nbsp;01
        </p>

        {console_ ? (
          <button
            type="button"
            className="console__exit"
            onClick={() => setConsole(false)}
          >
            Exit — Esc
          </button>
        ) : null}
      </div>

      <NightSky open={skyOpen} line={skyLine} onClose={() => setSkyOpen(false)} />
    </>
  );
}
