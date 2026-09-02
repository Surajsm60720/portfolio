/**
 * What this page actually cost the browser, measured in the browser.
 *
 * The design doc claims a performance budget. A claim a visitor cannot check
 * is just a claim, so the colophon reads the real numbers back out of the
 * Performance API and prints them.
 *
 * Exposed as an external store rather than effect state: the numbers are not
 * knowable on the server, they arrive across several events (resources, then
 * LCP), and getSnapshot must hand back a stable reference between those
 * events or React re-renders forever.
 */

export interface PageCost {
  requests: number;
  /** Bytes over the wire. Null when every entry reports 0 — see `cached`. */
  transferred: number | null;
  scriptBytes: number | null;
  fontCount: number;
  thirdParty: number;
  /** Largest Contentful Paint, ms. Null until the entry arrives. */
  lcp: number | null;
  /** True when the browser served this from cache, so transfer sizes read 0. */
  cached: boolean;
}

let snapshot: PageCost | null = null;
let lcp: number | null = null;
const listeners = new Set<() => void>();

let observer: PerformanceObserver | null = null;
let onLoad: (() => void) | null = null;

function measure(): PageCost {
  const resources = performance.getEntriesByType(
    "resource",
  ) as PerformanceResourceTiming[];
  const [navigation] = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];

  const origin = window.location.origin;
  let transferred = navigation?.transferSize ?? 0;
  let scriptBytes = 0;
  let decoded = navigation?.decodedBodySize ?? 0;
  let fontCount = 0;
  let thirdParty = 0;

  for (const entry of resources) {
    transferred += entry.transferSize;
    decoded += entry.decodedBodySize;

    if (entry.initiatorType === "script") scriptBytes += entry.transferSize;
    if (/\.(woff2?|ttf|otf)(\?|$)/.test(entry.name)) fontCount += 1;
    if (!entry.name.startsWith(origin) && entry.name.startsWith("http")) {
      thirdParty += 1;
    }
  }

  /* A repeat visit serves from cache and every transferSize reads 0. Showing
     "0 kB" would be true but misleading, so it is reported as cached instead
     of dressed up as a win. */
  const cached = transferred === 0 && decoded > 0;

  return {
    requests: resources.length + (navigation ? 1 : 0),
    transferred: cached ? null : transferred,
    scriptBytes: cached ? null : scriptBytes,
    fontCount,
    thirdParty,
    lcp,
    cached,
  };
}

function refresh() {
  snapshot = measure();
  for (const listener of listeners) listener();
}

function start() {
  refresh();

  if (typeof PerformanceObserver !== "undefined") {
    try {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) lcp = Math.round(last.startTime);
        refresh();
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      // Unsupported entry type; the row simply omits LCP.
    }
  }

  if (document.readyState !== "complete") {
    onLoad = () => refresh();
    window.addEventListener("load", onLoad, { once: true });
  }
}

function stop() {
  observer?.disconnect();
  observer = null;
  if (onLoad) window.removeEventListener("load", onLoad);
  onLoad = null;
}

export function subscribePageCost(onChange: () => void): () => void {
  listeners.add(onChange);
  if (listeners.size === 1) start();
  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0) stop();
  };
}

export function getPageCostSnapshot(): PageCost | null {
  return snapshot;
}

export function getPageCostServerSnapshot(): null {
  return null;
}

export function kb(bytes: number): string {
  return `${Math.round(bytes / 1024)} kB`;
}
