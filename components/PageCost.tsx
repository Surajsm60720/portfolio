"use client";

import { useSyncExternalStore } from "react";
import {
  getPageCostServerSnapshot,
  getPageCostSnapshot,
  kb,
  subscribePageCost,
} from "@/lib/page-cost";

/**
 * The performance budget in the design doc, read back out of the browser.
 * Renders nothing until real numbers exist — a placeholder full of dashes
 * would be worse than an absent row.
 */
export default function PageCost() {
  const cost = useSyncExternalStore(
    subscribePageCost,
    getPageCostSnapshot,
    getPageCostServerSnapshot,
  );

  if (!cost) return null;

  const cells: { label: string; value: string }[] = [
    { label: "Requests", value: String(cost.requests) },
    cost.cached
      ? { label: "Transferred", value: "cached" }
      : { label: "Transferred", value: kb(cost.transferred ?? 0) },
    ...(cost.cached
      ? []
      : [{ label: "JavaScript", value: kb(cost.scriptBytes ?? 0) }]),
    { label: "Fonts", value: String(cost.fontCount) },
    { label: "Third party", value: String(cost.thirdParty) },
    ...(cost.lcp === null
      ? []
      : [{ label: "LCP", value: `${(cost.lcp / 1000).toFixed(2)}s` }]),
  ];

  return (
    <dl className="cost">
      {cells.map((cell) => (
        <div className="cost__cell" key={cell.label}>
          <dt className="cost__label">{cell.label}</dt>
          <dd className="cost__value">{cell.value}</dd>
        </div>
      ))}
    </dl>
  );
}
