"use client";

import { useState } from "react";
import { formatCompactMoney } from "@/lib/format";

export interface Bar {
  id: string;
  /** Label under the bar. */
  axis: string;
  value: number;
  /** Tooltip heading, e.g. "Monday, October 20". */
  title: string;
  /** Tooltip body, e.g. "$1,240 from 41 orders". */
  detail: string;
  /** Rendered paler, for the comparison period. */
  faded?: boolean;
}

interface BarChartProps {
  bars: Bar[];
  ariaLabel: string;
  /** How axis values are written: "$2.5k" for money, "12" for counts. (A format name, not a function, so server components can pass it.) */
  axisFormat: "money" | "count";
  /** Show every nth axis label on narrow screens so they never collide. */
  thinLabelsOnPhone?: boolean;
  valueHeading: string;
}

/** Round a maximum up to a "nice" ceiling (1, 2, 2.5, 5 or 10 times a power of ten) for clean gridlines. */
export function niceCeiling(value: number): number {
  if (value <= 0) return 1;
  const power = 10 ** Math.floor(Math.log10(value));
  const fraction = value / power;
  const step = [1, 2, 2.5, 5, 10].find((s) => fraction <= s) ?? 10;
  return step * power;
}

export function BarChart({ bars, ariaLabel, axisFormat, thinLabelsOnPhone = false, valueHeading }: BarChartProps) {
  const formatAxis = (value: number) => (axisFormat === "money" ? formatCompactMoney(value) : String(Math.round(value)));
  const [active, setActive] = useState<number | null>(null);
  const ceiling = niceCeiling(Math.max(...bars.map((b) => b.value), 0));
  const activeBar = active === null ? null : bars[active];
  // Keep the tooltip inside the plot even for the first and last bars.
  const tooltipLeft = active === null ? 0 : Math.min(86, Math.max(14, ((active + 0.5) / bars.length) * 100));

  return (
    <figure>
      <div role="group" aria-label={ariaLabel} className="relative h-56 pl-11">
        <div aria-hidden className="absolute inset-y-0 left-0 flex w-10 flex-col justify-between text-right text-[11px] tabular-nums text-muted">
          <span className="-translate-y-1.5">{formatAxis(ceiling)}</span>
          <span>{formatAxis(ceiling / 2)}</span>
          <span className="translate-y-1.5">0</span>
        </div>

        <div className="relative h-full" onMouseLeave={() => setActive(null)}>
          {/* Recessive gridlines: they orient the eye but never compete with the bars. */}
          <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-line/70" />
            <div className="border-t border-dashed border-line/70" />
            <div className="border-t border-line" />
          </div>

          <div className="absolute inset-0 flex items-end gap-0.5">
            {bars.map((bar, i) => (
              <div
                key={bar.id}
                tabIndex={0}
                role="img"
                aria-label={`${bar.title}: ${bar.detail}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group flex h-full min-w-0 flex-1 cursor-default items-end rounded-md outline-offset-2"
              >
                <div
                  className={`w-full rounded-t-[4px] bg-accent transition-[filter,opacity] ${bar.faded ? "opacity-35" : ""} ${
                    active === i ? "brightness-110" : ""
                  }`}
                  style={{ height: `${Math.max((bar.value / ceiling) * 100, bar.value > 0 ? 1.5 : 0)}%` }}
                />
              </div>
            ))}
          </div>

          {activeBar && (
            <div
              role="status"
              className="pointer-events-none absolute -top-2 z-10 w-max max-w-[14rem] -translate-x-1/2 -translate-y-full rounded-xl border border-line bg-surface px-3 py-2 text-sm shadow-lg"
              style={{ left: `${tooltipLeft}%` }}
            >
              <p className="font-semibold">{activeBar.title}</p>
              <p className="tabular-nums text-muted">{activeBar.detail}</p>
            </div>
          )}
        </div>
      </div>

      <div aria-hidden className="mt-2 flex gap-0.5 pl-11">
        {bars.map((bar, i) => (
          <span
            key={bar.id}
            className={`min-w-0 flex-1 truncate text-center text-[11px] text-muted ${thinLabelsOnPhone && i % 2 === 1 ? "max-sm:invisible" : ""}`}
          >
            {bar.axis}
          </span>
        ))}
      </div>

      <details className="mt-3 text-sm">
        <summary className="inline-flex min-h-11 items-center text-muted underline underline-offset-2 hover:text-foreground">View as table</summary>
        <table className="mt-1 w-full text-left">
          <thead className="text-muted">
            <tr>
              <th className="py-1 pr-4 font-medium">When</th>
              <th className="py-1 font-medium">{valueHeading}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {bars.map((bar) => (
              <tr key={bar.id}>
                <td className="py-1.5 pr-4">{bar.title}</td>
                <td className="py-1.5 tabular-nums">{bar.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
