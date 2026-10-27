import { BarChart3, Boxes, LayoutGrid, PackageCheck, Radio, ShieldCheck, type LucideIcon } from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: LayoutGrid,
    title: "Table map and order builder",
    body: "Tap a table, build the order with modifiers like “no onion”, and send it. Totals update as you go, built for fingers on a tablet.",
  },
  {
    icon: Radio,
    title: "Live kitchen display",
    body: "Tickets appear in about two seconds in New, Preparing and Ready columns. Ages turn amber, then red, as they wait.",
  },
  {
    icon: Boxes,
    title: "A menu that knows its stock",
    body: "Each dish shows the portions left, worked out from live stock and its recipe. Low dishes warn and sold-out dishes can't be ordered.",
  },
  {
    icon: PackageCheck,
    title: "Reorder in one tap",
    body: "Suggested quantities, the dishes each shortage affects, a supplier-ready order to copy, and one tap to record the delivery.",
  },
  {
    icon: BarChart3,
    title: "Insights that matter",
    body: "Revenue by day, best sellers and your busiest hours, compared with the week before so you can see what is working.",
  },
  {
    icon: ShieldCheck,
    title: "Roles that mean it",
    body: "Waiters, kitchen and managers each see only what they need. Permissions are enforced on the server, not just hidden in the interface.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-5xl">Everything service needs, nothing it doesn&apos;t</h2>
          <p className="mt-4 text-lg text-muted">Built around how a busy floor actually works.</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="group rounded-3xl border border-line bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg"
            >
              <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-accent/12 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon aria-hidden className="size-6" />
              </span>
              <h3 className="font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
