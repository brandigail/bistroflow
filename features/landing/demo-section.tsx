import { ArrowRight, ChefHat, ConciergeBell, UserCog, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { demoLogin } from "@/features/auth/actions";
import { DEMO_STAFF } from "@/features/auth/demo-staff";
import type { StaffRole } from "@/types";

const ROLE_CARDS: Record<StaffRole, { icon: LucideIcon; heading: string; tryThis: string }> = {
  waiter: { icon: ConciergeBell, heading: "Front of house", tryThis: "Open a table, build an order with modifiers and send it to the kitchen." },
  kitchen: { icon: ChefHat, heading: "Kitchen", tryThis: "Watch tickets arrive live and move them from New to Ready." },
  manager: { icon: UserCog, heading: "Manager", tryThis: "Review insights, then reorder the ingredients that are running low." },
};

export function DemoSection() {
  return (
    <section id="demo" className="scroll-mt-20 border-t border-line bg-surface-2/50 py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-5xl">Try it now, as anyone on the team</h2>
          <p className="mt-4 text-lg text-muted">
            Pick a role and you&apos;re in, with no sign-up. The demo comes loaded with a menu, live orders and two weeks of sales. Open two
            roles in two windows to watch an order travel from the table to the kitchen.
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {DEMO_STAFF.map((member) => {
            const card = ROLE_CARDS[member.role];
            const Icon = card.icon;
            return (
              <li key={member.id} className="flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-sm">
                <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                  <Icon aria-hidden className="size-6" />
                </span>
                <p className="text-sm font-semibold uppercase tracking-widest text-muted">{card.heading}</p>
                <h3 className="font-display text-2xl font-semibold">{member.name.split(" (")[0]}</h3>
                <p className="mt-2 text-muted">{member.blurb}.</p>
                <p className="mt-3 text-sm">
                  <span className="font-semibold">Try this:</span> <span className="text-muted">{card.tryThis}</span>
                </p>
                <form action={demoLogin.bind(null, member.role)} className="mt-auto pt-6">
                  <button type="submit" className="btn btn-primary btn-lg w-full">
                    Enter as {member.role}
                    <ArrowRight aria-hidden className="size-4" />
                  </button>
                </form>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-center text-sm text-muted">
          Prefer to type? <Link href="/login" className="font-medium text-foreground underline underline-offset-2">Sign in with a PIN</Link>. Demo
          PINs: 1111, 2222 and 3333.
        </p>
      </div>
    </section>
  );
}
