import { cn } from "@/lib/cn";

/**
 * The site mark: an original "A" struck through by a red slash, held inside a ring.
 * Parts carry class hooks (em-ring, em-ticks, em-a, em-slash) so timelines can draw them.
 */
export function Emblem({
  className,
  ring = "currentColor",
  letter = "currentColor",
  slash = "#e8202a",
  title,
}: {
  className?: string;
  ring?: string;
  letter?: string;
  slash?: string;
  title?: string;
}) {
  const ticks = Array.from({ length: 6 }, (_, i) => {
    const a = ((i * 60 - 90) * Math.PI) / 180;
    const x1 = 100 + Math.cos(a) * 70;
    const y1 = 100 + Math.sin(a) * 70;
    const x2 = 100 + Math.cos(a) * 78;
    const y2 = 100 + Math.sin(a) * 78;
    return `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }).join("");

  return (
    <svg
      viewBox="0 0 200 200"
      className={cn("overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <circle className="em-ring" cx="100" cy="100" r="86" fill="none" stroke={ring} strokeWidth="9" />
      <path className="em-ticks" d={ticks} stroke={ring} strokeWidth="4" strokeLinecap="round" />
      <path
        className="em-a"
        d="M100 30L152 162L128 162L117 134L83 134L72 162L48 162ZM100 80L111 112L89 112Z"
        fill={letter}
        fillRule="evenodd"
        stroke={letter}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path className="em-slash" d="M14 148L182 98L188 113L20 163Z" fill={slash} />
    </svg>
  );
}

/** Wordmark: red block + display type. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Emblem className="h-7 w-7 text-ink" />
      <span className="font-display bg-hero px-1.5 pt-1 pb-0.5 text-[1.15rem] leading-none tracking-wide text-white">
        Assemble
      </span>
    </span>
  );
}
