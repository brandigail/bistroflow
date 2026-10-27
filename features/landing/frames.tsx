import Image from "next/image";

/** A desktop browser window around a product screenshot. */
export function BrowserFrame({
  src,
  alt,
  label,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  label: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/20 ${className}`}>
      <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
        </span>
        <span className="truncate rounded-md bg-background/70 px-3 py-0.5 text-xs text-muted">{label}</span>
      </div>
      <Image
        src={src}
        alt={alt}
        width={1920}
        height={1200}
        priority={priority}
        sizes="(min-width: 1024px) 640px, 100vw"
        className="block h-auto w-full"
      />
    </div>
  );
}

/** A phone around a mobile screenshot. */
export function PhoneFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[2rem] border-[6px] border-foreground/90 bg-background shadow-2xl shadow-black/30 ${className}`}>
      <Image src={src} alt={alt} width={780} height={1688} sizes="200px" className="block h-auto w-full" />
    </div>
  );
}
