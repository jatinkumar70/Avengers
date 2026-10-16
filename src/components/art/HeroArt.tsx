import { useId, type ReactNode } from "react";
import type { HeroId } from "@/data/heroes";

/**
 * Original poster-style illustrations for each hero.
 * All art is hand-built SVG (viewBox 400×500) so it stays crisp at any size,
 * weighs a few KB and never 404s.
 */

const INK = "#0b0b0c";
const PAPER = "#f4f1ea";

function useSvgId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

/** Polar → cartesian helper. */
const pt = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};
const f = (n: number) => n.toFixed(1);

/** Comic "sunburst" rays. */
function Burst({ cx, cy, rays = 28, color, opacity = 1 }: { cx: number; cy: number; rays?: number; color: string; opacity?: number }) {
  const step = 360 / rays;
  const d = Array.from({ length: rays / 2 }, (_, i) => {
    const a = i * step * 2;
    const [x1, y1] = pt(cx, cy, 900, a);
    const [x2, y2] = pt(cx, cy, 900, a + step);
    return `M${cx} ${cy}L${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}Z`;
  }).join("");
  return <path d={d} fill={color} opacity={opacity} />;
}

/** Spider-web generator (radials + sagging rings). */
export function webPath(cx: number, cy: number, radii: number[], spokes = 16, start = -90) {
  const step = 360 / spokes;
  let d = "";
  const outer = radii[radii.length - 1] * 1.15;
  for (let i = 0; i < spokes; i++) {
    const [x, y] = pt(cx, cy, outer, start + i * step);
    d += `M${cx} ${cy}L${f(x)} ${f(y)}`;
  }
  radii.forEach((r) => {
    for (let i = 0; i < spokes; i++) {
      const a1 = start + i * step;
      const a2 = a1 + step;
      const [x1, y1] = pt(cx, cy, r, a1);
      const [x2, y2] = pt(cx, cy, r, a2);
      const [qx, qy] = pt(cx, cy, r * 0.84, a1 + step / 2);
      d += `M${f(x1)} ${f(y1)}Q${f(qx)} ${f(qy)} ${f(x2)} ${f(y2)}`;
    }
  });
  return d;
}

function starPath(cx: number, cy: number, R: number, r: number) {
  return (
    Array.from({ length: 10 }, (_, i) => {
      const [x, y] = pt(cx, cy, i % 2 ? r : R, -90 + i * 36);
      return `${i ? "L" : "M"}${f(x)} ${f(y)}`;
    }).join("") + "Z"
  );
}

function Frame({ id, bg, dot, children, label }: { id: string; bg: string; dot: string; children: ReactNode; label: string }) {
  return (
    <>
      <title>{label}</title>
      <defs>
        <pattern id={`${id}-ht`} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="1.9" fill={dot} />
        </pattern>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-m`}>
          <rect width="400" height="500" fill={`url(#${id}-fade)`} />
        </mask>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width="400" height="500" fill={bg} />
      {children}
      <rect width="400" height="500" fill={`url(#${id}-ht)`} mask={`url(#${id}-m)`} />
    </>
  );
}

function IronMan({ id }: { id: string }) {
  return (
    <Frame id={id} bg="#c8161d" dot="#7a0a0f" label="Iron Man helmet illustration">
      <Burst cx={200} cy={240} color="#a30f15" />
      <circle cx="200" cy="245" r="178" fill={INK} />
      <circle cx="200" cy="245" r="178" fill="none" stroke="#f3b33d" strokeWidth="2" strokeDasharray="2 10" />
      <g data-part="helmet">
        <circle cx="90" cy="238" r="18" fill="#8f0d13" stroke={INK} strokeWidth="5" />
        <circle cx="310" cy="238" r="18" fill="#8f0d13" stroke={INK} strokeWidth="5" />
        <path
          d="M200 58C262 58 312 92 318 160L322 250C322 300 306 340 284 372L246 414Q200 432 154 414L116 372C94 340 78 300 78 250L82 160C88 92 138 58 200 58Z"
          fill="#a50f16"
          stroke={INK}
          strokeWidth="6"
        />
        <path d="M200 58C262 58 312 92 318 160L322 250C322 300 306 340 284 372L246 414Q222 424 200 426Z" fill="#000" opacity="0.18" />
        <path
          d="M200 104C240 104 270 120 280 156L284 236C284 270 274 300 260 324L238 370Q200 388 162 370L140 324C126 300 116 270 116 236L120 156C130 120 160 104 200 104Z"
          fill="#f3b33d"
          stroke={INK}
          strokeWidth="5"
        />
        <path d="M200 104C240 104 270 120 280 156L284 236C284 270 274 300 260 324L238 370Q220 378 200 380Z" fill="#c9861a" opacity="0.55" />
        <path d="M150 122Q178 108 200 108L200 118Q172 122 158 134Z" fill="#fff" opacity="0.55" />
        <path d="M200 104L200 170" stroke={INK} strokeWidth="3" opacity="0.45" />
        <path d="M120 172Q160 160 200 178Q240 160 280 172" stroke={INK} strokeWidth="3" fill="none" opacity="0.4" />
        <path d="M126 262L168 276L176 330M274 262L232 276L224 330" stroke={INK} strokeWidth="4" fill="none" strokeLinejoin="round" />
        <path d="M172 338L228 338M200 350L200 374" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <g filter={`url(#${id}-glow)`} className="animate-pulse-glow">
          <path d="M130 196L188 212L184 228L136 220Z" fill="#eafcff" />
          <path d="M270 196L212 212L216 228L264 220Z" fill="#eafcff" />
        </g>
      </g>
      <g transform="translate(200 468)">
        <circle r="18" fill="#bff4ff" filter={`url(#${id}-glow)`} className="animate-pulse-glow" />
        <circle r="18" fill="none" stroke={INK} strokeWidth="4" />
      </g>
    </Frame>
  );
}

function SpiderMan({ id }: { id: string }) {
  const head =
    "M200 82C290 82 332 160 330 240C328 330 280 420 200 430C120 420 72 330 70 240C68 160 110 82 200 82Z";
  return (
    <Frame id={id} bg="#1d4fb8" dot="#0f2f73" label="Spider-Man mask illustration">
      <path d={webPath(200, 250, [70, 130, 195, 265, 340], 18)} stroke="#fff" strokeOpacity="0.16" strokeWidth="1.5" fill="none" />
      <defs>
        <clipPath id={`${id}-head`}>
          <path d={head} />
        </clipPath>
        <linearGradient id={`${id}-shade`} x1="0" x2="1">
          <stop offset="0.45" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.32" />
        </linearGradient>
      </defs>
      <path d={head} fill="#d71920" />
      <g clipPath={`url(#${id}-head)`}>
        <path d={webPath(200, 268, [38, 78, 120, 165, 215], 16)} stroke={INK} strokeWidth="3" fill="none" opacity="0.85" />
        <rect width="400" height="500" fill={`url(#${id}-shade)`} />
        <path d="M120 120Q170 92 214 96" stroke="#fff" strokeOpacity="0.35" strokeWidth="10" strokeLinecap="round" fill="none" />
      </g>
      <path d={head} fill="none" stroke={INK} strokeWidth="6" />
      <path d="M98 214C118 156 176 168 190 236C164 258 112 262 98 214Z" fill={PAPER} stroke={INK} strokeWidth="11" strokeLinejoin="round" />
      <path d="M302 214C282 156 224 168 210 236C236 258 288 262 302 214Z" fill={PAPER} stroke={INK} strokeWidth="11" strokeLinejoin="round" />
      <path d="M120 206C132 186 156 186 168 210" stroke="#9fc3ff" strokeWidth="5" fill="none" opacity="0.6" strokeLinecap="round" />
      <path d="M280 206C268 186 244 186 232 210" stroke="#9fc3ff" strokeWidth="5" fill="none" opacity="0.6" strokeLinecap="round" />
    </Frame>
  );
}

function Thor({ id }: { id: string }) {
  return (
    <Frame id={id} bg="#10213a" dot="#1f3a63" label="Mjolnir, Thor's hammer, with lightning">
      <defs>
        <radialGradient id={`${id}-sky`} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#7cc4ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7cc4ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dfe4ec" />
          <stop offset="1" stopColor="#8a93a5" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${id}-sky)`} />
      <g filter={`url(#${id}-glow)`} stroke="#d9f1ff" strokeWidth="4" fill="none" strokeLinejoin="bevel" className="animate-flicker">
        <path d="M40 0L96 92L70 100L138 196L110 204L170 300" />
        <path d="M372 10L320 96L344 106L282 190L306 200L250 290" />
        <path d="M20 330L76 360L60 372L120 410" opacity="0.7" />
        <path d="M384 320L330 356L350 366L292 410" opacity="0.7" />
      </g>
      <g data-part="hammer">
        <rect x="186" y="236" width="28" height="172" fill="#6b3f1f" stroke={INK} strokeWidth="5" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M188 ${246 + i * 13.5}L212 ${256 + i * 13.5}`} stroke="#3d2210" strokeWidth="4" />
        ))}
        <rect x="178" y="404" width="44" height="20" rx="4" fill={`url(#${id}-steel)`} stroke={INK} strokeWidth="5" />
        <path d="M200 424C168 450 170 486 200 488C230 486 232 450 200 424" stroke="#6b3f1f" strokeWidth="8" fill="none" />
        <path d="M106 112L294 112L310 128L310 228L294 244L106 244L90 228L90 128Z" fill="#8a93a5" stroke={INK} strokeWidth="6" />
        <path d="M120 126L280 126L294 140L294 216L280 230L120 230L106 216L106 140Z" fill={`url(#${id}-steel)`} />
        <path d="M120 126L280 126L294 140L106 140Z" fill="#fff" opacity="0.45" />
        <circle cx="200" cy="178" r="34" fill="none" stroke={INK} strokeWidth="4" />
        <circle cx="200" cy="178" r="22" fill="none" stroke={INK} strokeWidth="2" opacity="0.6" />
        <path d="M200 148Q228 184 200 208Q172 184 200 148ZM172 164Q206 168 226 196M228 164Q194 168 174 196" stroke={INK} strokeWidth="3" fill="none" />
        <path d="M126 152L150 152M126 204L150 204M250 152L274 152M250 204L274 204" stroke={INK} strokeWidth="3" opacity="0.5" />
      </g>
    </Frame>
  );
}

function CaptainAmerica({ id }: { id: string }) {
  return (
    <Frame id={id} bg="#efece4" dot="#e8202a" label="Captain America's shield">
      <defs>
        <linearGradient id={`${id}-sheen`} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d="M-40 360L440 120L440 210L-40 450Z" fill="#1b3f8f" />
      <g stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.85">
        <path d="M18 168L82 168M8 196L66 196M24 300L74 300M10 328L60 328" />
      </g>
      <g data-part="shield" style={{ transformOrigin: "200px 250px" }}>
        <circle cx="206" cy="258" r="152" fill={INK} />
        <circle cx="200" cy="250" r="150" fill="#c8161d" stroke={INK} strokeWidth="6" />
        <circle cx="200" cy="250" r="117" fill={PAPER} stroke={INK} strokeWidth="3" />
        <circle cx="200" cy="250" r="85" fill="#c8161d" stroke={INK} strokeWidth="3" />
        <circle cx="200" cy="250" r="56" fill="#1b3f8f" stroke={INK} strokeWidth="3" />
        <path d={starPath(200, 250, 54, 21)} fill={PAPER} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="200" cy="250" r="150" fill={`url(#${id}-sheen)`} />
        <path d="M110 160Q150 118 210 112" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.7" />
      </g>
    </Frame>
  );
}

function DoctorStrange({ id }: { id: string }) {
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const [x1, y1] = pt(200, 240, 160, i * 6);
    const [x2, y2] = pt(200, 240, i % 5 ? 166 : 174, i * 6);
    return `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
  }).join("");
  const runes = Array.from({ length: 24 }, (_, i) => {
    const [x, y] = pt(200, 240, 136, i * 15);
    return <rect key={i} x={x - 4} y={y - 4} width="8" height="8" transform={`rotate(${i * 15 + 45} ${f(x)} ${f(y)})`} />;
  });
  return (
    <Frame id={id} bg="#2a0f3d" dot="#4a1d68" label="Doctor Strange's mystic mandala and the Eye of Agamotto">
      <defs>
        <radialGradient id={`${id}-aura`} cx="0.5" cy="0.48" r="0.5">
          <stop offset="0" stopColor="#ff8a1f" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff8a1f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${id}-aura)`} />
      <g filter={`url(#${id}-glow)`} stroke="#ffb15c" fill="none">
        <g className="animate-spin-slow" style={{ transformOrigin: "200px 240px" }}>
          <circle cx="200" cy="240" r="180" strokeWidth="3" />
          <circle cx="200" cy="240" r="160" strokeWidth="1.5" />
          <path d={ticks} strokeWidth="2" />
          <rect x="90" y="130" width="220" height="220" strokeWidth="2.5" />
          <rect x="90" y="130" width="220" height="220" strokeWidth="2.5" transform="rotate(45 200 240)" />
        </g>
        <g className="animate-spin-rev" style={{ transformOrigin: "200px 240px" }}>
          <circle cx="200" cy="240" r="112" strokeWidth="2" />
          <g fill="#ffb15c" stroke="none">{runes}</g>
          <circle cx="200" cy="240" r="76" strokeWidth="2" strokeDasharray="6 6" />
        </g>
      </g>
      <g data-part="eye">
        <path d="M118 240Q200 168 282 240Q200 312 118 240Z" fill="#f3b33d" stroke={INK} strokeWidth="5" />
        <path d="M100 240L126 226L126 254ZM300 240L274 226L274 254Z" fill="#f3b33d" stroke={INK} strokeWidth="4" />
        <path d="M146 240Q200 196 254 240Q200 284 146 240Z" fill="#14b36f" stroke={INK} strokeWidth="4" filter={`url(#${id}-glow)`} />
        <circle cx="200" cy="240" r="16" fill={INK} />
        <circle cx="194" cy="234" r="4" fill="#fff" />
      </g>
      <g fill="#ffb15c" opacity="0.8">
        <circle cx="70" cy="430" r="3" />
        <circle cx="330" cy="70" r="2.5" />
        <circle cx="352" cy="420" r="2" />
        <circle cx="52" cy="90" r="2" />
      </g>
    </Frame>
  );
}

function BlackPanther({ id }: { id: string }) {
  const head =
    "M200 70L232 78L262 58L278 106C318 138 330 190 326 250C322 330 280 400 200 422C120 400 78 330 74 250C70 190 82 138 122 106L138 58L168 78Z";
  const fangs = Array.from({ length: 13 }, (_, i) => {
    const x = 92 + i * 18;
    const y = 446 + Math.pow((x - 200) / 108, 2) * -22;
    return <path key={i} d={`M${x - 7} ${f(y)}L${x + 7} ${f(y)}L${x} ${f(y + 30 - Math.abs(x - 200) / 10)}Z`} />;
  });
  return (
    <Frame id={id} bg="#121014" dot="#2b2236" label="Black Panther mask illustration">
      <defs>
        <radialGradient id={`${id}-v`} cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor="#9b6bff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#9b6bff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-mk`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#3a3545" />
          <stop offset="1" stopColor="#141217" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${id}-v)`} />
      <path d={head} fill={`url(#${id}-mk)`} stroke="#b89cff" strokeWidth="3" filter={`url(#${id}-glow)`} />
      <g stroke="#c9ccd6" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d="M200 84L200 150M200 150L160 178L112 198M200 150L240 178L288 198" />
        <path d="M200 112L146 150L104 180M200 112L254 150L296 180" opacity="0.6" />
        <path d="M200 238L188 300L200 318L212 300Z" />
        <path d="M112 270L150 302L162 360M288 270L250 302L238 360" />
        <path d="M166 352Q200 366 234 352" />
      </g>
      <g filter={`url(#${id}-glow)`}>
        <path d="M116 214L184 234L178 256L126 244Z" fill={PAPER} />
        <path d="M284 214L216 234L222 256L274 244Z" fill={PAPER} />
      </g>
      <path d="M84 446Q200 410 316 446" stroke="#c9ccd6" strokeWidth="5" fill="none" />
      <g fill="#dfe2ea" stroke={INK} strokeWidth="2">{fangs}</g>
    </Frame>
  );
}

const ART: Record<HeroId, (p: { id: string }) => ReactNode> = {
  "iron-man": IronMan,
  "spider-man": SpiderMan,
  thor: Thor,
  "captain-america": CaptainAmerica,
  "doctor-strange": DoctorStrange,
  "black-panther": BlackPanther,
};

export function HeroArt({ hero, className, decorative = false }: { hero: HeroId; className?: string; decorative?: boolean }) {
  const id = useSvgId(hero);
  const Art = ART[hero];
  return (
    <svg
      viewBox="0 0 400 500"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      <Art id={id} />
    </svg>
  );
}
