import { ArrowRight, Radio, Sparkles, TriangleAlert } from "lucide-react";
import { BrowserFrame, PhoneFrame } from "./frames";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-hero absolute inset-0 -z-10" />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:pb-28 lg:pt-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm font-medium text-muted shadow-sm">
            <Sparkles aria-hidden className="size-4 text-accent" />
            POS · live kitchen display · smart inventory
          </p>
          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            The point of sale that <span className="text-accent">knows your kitchen.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Orders reach the kitchen in seconds. Every dish deducts its ingredients automatically. And you hear about a shortage
            before a guest does, with a reorder list ready to send.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#demo" className="btn btn-primary btn-lg px-6 text-base">
              Try the live demo
              <ArrowRight aria-hidden className="size-4" />
            </a>
            <a href="#how" className="btn btn-outline btn-lg px-6 text-base">
              See how it works
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <li>No sign-up</li>
            <li>One click into any role</li>
            <li>Works on phone, tablet and desktop</li>
          </ul>
        </div>

        <div className="relative pb-10 sm:pb-0">
          <BrowserFrame src="/screens/kitchen.jpg" alt="The kitchen display with tickets in New, Preparing and Ready columns" label="bistroflow / kitchen" priority />
          <PhoneFrame
            src="/screens/phone-pos.jpg"
            alt="Taking an order on a phone"
            className="animate-float absolute -bottom-2 right-3 w-[28%] max-w-[10rem] sm:-bottom-8 sm:-right-4"
          />
          <div className="animate-float-slow absolute -left-2 top-[18%] hidden items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2 text-sm font-medium shadow-xl sm:flex lg:-left-8">
            <Radio aria-hidden className="size-4 text-emerald-500" />
            Table 5 · Ready to serve
          </div>
          <div className="animate-float absolute -bottom-3 left-4 hidden items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-2 text-sm font-medium shadow-xl sm:flex">
            <TriangleAlert aria-hidden className="size-4 text-amber-500" />
            Romaine out · Caesar Salad paused
          </div>
        </div>
      </div>
    </section>
  );
}
