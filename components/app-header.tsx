import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/auth";
import { logout } from "@/features/auth/actions";
import { canAccessPath } from "@/lib/permissions";
import { BrandMark } from "./brand-mark";

const LINKS = [
  { href: "/", label: "Floor" },
  { href: "/kds", label: "Kitchen" },
  { href: "/inventory", label: "Inventory" },
];

async function SessionNav({ current }: { current: string }) {
  const session = await auth();
  if (!session) return null;
  const { role, name } = session.user;

  return (
    <nav aria-label="Main" className="flex flex-wrap items-center gap-2">
      {LINKS.filter((l) => l.href !== current && canAccessPath(role, l.href)).map((l) => (
        <Link key={l.href} href={l.href} className="flex min-h-11 items-center rounded-xl border border-line px-4 text-sm font-semibold">
          {l.label}
        </Link>
      ))}
      <form action={logout} className="flex items-center gap-2">
        <span className="hidden text-sm text-muted sm:inline">{name}</span>
        <button type="submit" className="min-h-11 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground">
          Sign out
        </button>
      </form>
    </nav>
  );
}

/** Brand + role-aware navigation. `current` hides the link to the page you are already on. */
export function AppHeader({ current }: { current: string }) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <BrandMark />
      <Suspense fallback={null}>
        <SessionNav current={current} />
      </Suspense>
    </header>
  );
}
