import { Check } from "lucide-react";
import { BrowserFrame } from "./frames";

const ROWS = [
  {
    eyebrow: "Kitchen",
    title: "A board your cooks will actually use",
    points: ["Tap a ticket to move it forward, with big targets that work with wet hands", "Colour-coded ages show what has been waiting too long", "Waiters mark served, so tables turn faster"],
    src: "/screens/kitchen.jpg",
    alt: "Kitchen display board",
    label: "bistroflow / kitchen",
  },
  {
    eyebrow: "Inventory",
    title: "Know what to buy before you run out",
    points: ["Shortages list the dishes they affect", "Suggested quantities top each ingredient back up, and you can edit them", "Copy a supplier-ready order, then record the delivery in one tap"],
    src: "/screens/inventory.jpg",
    alt: "Inventory page with an editable reorder list",
    label: "bistroflow / inventory",
  },
  {
    eyebrow: "Insights",
    title: "See what sells, and when",
    points: ["Revenue compared with the week before", "Best sellers and the hours that make your day", "Every bar is explorable, with a table view for screen readers"],
    src: "/screens/insights.jpg",
    alt: "Insights page with revenue by day",
    label: "bistroflow / insights",
  },
];

export function Showcase() {
  return (
    <section className="space-y-24 pb-24">
      {ROWS.map((row, i) => (
        <div key={row.title} className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div className={i % 2 === 1 ? "lg:order-2" : ""}>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">{row.eyebrow}</p>
            <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">{row.title}</h2>
            <ul className="mt-6 space-y-3">
              {row.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                    <Check aria-hidden className="size-3.5" />
                  </span>
                  <span className="text-muted">{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <BrowserFrame src={row.src} alt={row.alt} label={row.label} className={i % 2 === 1 ? "lg:order-1" : ""} />
        </div>
      ))}
    </section>
  );
}
