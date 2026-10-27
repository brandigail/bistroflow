import { BarChart3, ChefHat, LayoutGrid, LogOut, Package, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/auth";
import { logout } from "@/features/auth/actions";
import { canAccessPath } from "@/lib/permissions";
import { BrandMark } from "./brand-mark";
import { ThemeToggle } from "./theme-toggle";

const LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/floor", label: "Floor", icon: LayoutGrid },
  { href: "/kds", label: "Kitchen", icon: ChefHat },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/insights", label: "Insights", icon: BarChart3 },
];

async function SessionNav({ current }: { current: string }) {
  await connection(); // depends on the visitor's cookies, so never prerendered
  const session = await auth();
  if (!session) return null;
  const { role, name } = session.user;

  return (
    <>
      <nav aria-label="Main" className="flex gap-1 rounded-2xl border border-line bg-surface p-1 shadow-sm">
        {LINKS.filter((l) => canAccessPath(role, l.href)).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={href === current ? "page" : undefined}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-foreground aria-[current=page]:bg-accent aria-[current=page]:text-accent-foreground aria-[current=page]:shadow-sm"
          >
            <Icon aria-hidden className="size-4" />
            <span className="max-sm:sr-only">{label}</span>
          </Link>
        ))}
      </nav>
      <form action={logout} className="flex items-center gap-2">
        <span className="hidden text-sm text-muted lg:inline">{name}</span>
        <button type="submit" className="btn btn-outline text-sm" aria-label={`Sign out ${name}`}>
          <LogOut aria-hidden className="size-4" />
          <span className="max-sm:sr-only">Sign out</span>
        </button>
      </form>
    </>
  );
}

/** Brand + role-aware navigation. The current page is highlighted. */
export function AppHeader({ current }: { current: string }) {
  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <BrandMark />
      <div className="flex flex-wrap items-center gap-2">
        <Suspense fallback={null}>
          <SessionNav current={current} />
        </Suspense>
        <ThemeToggle />
      </div>
    </header>
  );
}
