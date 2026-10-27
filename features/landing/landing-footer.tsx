import { BrandMark } from "@/components/brand-mark";

export function LandingFooter() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
        <div>
          <BrandMark />
          <p className="mt-1 text-sm text-muted">A portfolio project by Brandon Greeff-Myers.</p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
          <li>
            <a href="https://github.com/brandigail/bistroflow" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center underline-offset-2 hover:text-foreground hover:underline">
              Source on GitHub
            </a>
          </li>
          <li>
            <a href="#demo" className="inline-flex min-h-11 items-center underline-offset-2 hover:text-foreground hover:underline">
              Live demo
            </a>
          </li>
          <li className="inline-flex min-h-11 items-center">Demo data is fictional and resets regularly.</li>
        </ul>
      </div>
    </footer>
  );
}
