import { ArrowUpRight, GitCommitHorizontal, Lock, Rows3, Timer } from "lucide-react";

const REPO_URL = "https://github.com/brandigail/bistroflow";

const POINTS = [
  {
    icon: Rows3,
    title: "Stock that can't lie",
    body: "An order and its ingredient deductions commit in one database transaction. If any ingredient is short, nothing is applied.",
  },
  {
    icon: GitCommitHorizontal,
    title: "No skipped states",
    body: "Ticket updates are compare-and-set, so two screens tapping the same ticket can never jump a stage or double-apply.",
  },
  {
    icon: Lock,
    title: "Authorization in three layers",
    body: "Route redirects, server-rendered pages and every API handler each check the role, driven by one tested permission matrix.",
  },
  {
    icon: Timer,
    title: "Real-time without WebSockets",
    body: "Live updates run through one swappable polling hook, so the transport can change without touching a single screen.",
  },
];

export function Engineering() {
  return (
    <section className="py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="rounded-[2rem] border border-line bg-foreground p-8 text-background sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">For the technical reader</p>
              <h2 className="font-display mt-2 text-3xl font-semibold sm:text-4xl">Built like production software</h2>
              <p className="mt-4 text-background/70">
                Next.js, TypeScript in strict mode, Postgres on Neon, a unit-test suite, and CI on every push. The interesting parts are the
                ones you can&apos;t see in a screenshot.
              </p>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="btn mt-6 bg-background text-foreground hover:brightness-95"
              >
                Read the source
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {POINTS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="rounded-2xl border border-background/15 bg-background/5 p-5">
                  <Icon aria-hidden className="mb-3 size-5 text-accent" />
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-background/70">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
