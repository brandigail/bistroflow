import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-md flex-1 flex-col items-start gap-4 p-6 pt-16">
      <BrandMark />
      <p className="font-display mt-8 text-6xl font-semibold text-accent">404</p>
      <h1 className="font-display text-3xl font-semibold">That table isn&apos;t on the floor plan</h1>
      <p className="text-muted">The page you asked for doesn&apos;t exist, or it has moved.</p>
      <Link href="/" className="flex min-h-12 items-center rounded-xl bg-accent px-5 font-semibold text-accent-foreground">
        Back to the floor
      </Link>
    </main>
  );
}
