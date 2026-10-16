import { cn } from "@/lib/cn";

/** Deterministic PRNG so server and client render identical "random" art. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Jagged comic-book SFX burst ("KA-POW!"). */
export function SfxBurst({
  text,
  className,
  fill = "#f5c518",
  textColor = "#0b0b0c",
  seed = 7,
}: {
  text: string;
  className?: string;
  fill?: string;
  textColor?: string;
  seed?: number;
}) {
  const rnd = seeded(seed);
  const n = 22;
  const d =
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const r = i % 2 ? 62 + rnd() * 8 : 92 + rnd() * 16;
      return `${i ? "L" : "M"}${(120 + Math.cos(a) * r * 1.18).toFixed(1)} ${(100 + Math.sin(a) * r * 0.86).toFixed(1)}`;
    }).join("") + "Z";
  return (
    <svg viewBox="0 0 240 200" className={cn("overflow-visible", className)} aria-hidden="true">
      <path d={d} fill="#0b0b0c" transform="translate(6 6)" />
      <path d={d} fill={fill} stroke="#0b0b0c" strokeWidth="4" strokeLinejoin="round" />
      <text
        x="120"
        y="114"
        textAnchor="middle"
        fontFamily="var(--font-bangers), var(--font-anton), sans-serif"
        fontSize={text.length > 7 ? 34 : 42}
        fill={textColor}
        stroke="#0b0b0c"
        strokeWidth="1"
        transform="rotate(-6 120 100)"
        letterSpacing="1"
      >
        {text}
      </text>
    </svg>
  );
}

/** Radial speed lines (comic "focus" lines). */
export function SpeedLines({
  className,
  count = 90,
  seed = 3,
  inner = 0.32,
}: {
  className?: string;
  count?: number;
  seed?: number;
  inner?: number;
}) {
  const rnd = seeded(seed);
  const lines = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + rnd() * 0.04;
    const r1 = 500 * (inner + rnd() * 0.22);
    const w = Math.round((0.6 + rnd() * 2.4) * 10) / 10;
    const x1 = 500 + Math.cos(a) * r1;
    const y1 = 500 + Math.sin(a) * r1;
    const x2 = 500 + Math.cos(a) * 760;
    const y2 = 500 + Math.sin(a) * 760;
    return { d: `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`, w };
  });
  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {lines.map((l, i) => (
        <path key={i} className="speed-line" d={l.d} stroke="currentColor" strokeWidth={l.w} strokeLinecap="round" />
      ))}
    </svg>
  );
}

/** Small corner registration marks — a cinematic HUD frame. */
export function CornerMarks({ className }: { className?: string }) {
  const c = "absolute h-4 w-4 border-current";
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
      <span className={cn(c, "top-0 left-0 border-t-2 border-l-2")} />
      <span className={cn(c, "top-0 right-0 border-t-2 border-r-2")} />
      <span className={cn(c, "bottom-0 left-0 border-b-2 border-l-2")} />
      <span className={cn(c, "right-0 bottom-0 border-r-2 border-b-2")} />
    </div>
  );
}
