import Link from "next/link";

/** Wordmark: an ember tile with a serif "B" next to the product name. */
export function BrandMark() {
  return (
    <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="BistroFlow home">
      <span
        aria-hidden
        className="font-display flex size-9 items-center justify-center rounded-xl bg-accent text-xl font-bold text-accent-foreground"
      >
        B
      </span>
      <span className="font-display text-xl font-semibold tracking-tight">BistroFlow</span>
    </Link>
  );
}
