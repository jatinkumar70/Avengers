"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useExperience } from "@/components/providers/Experience";
import { Emblem } from "@/components/art/Emblem";
import { seeded } from "@/components/art/Comic";

const CX = 500;
const CY = 500;
const SPOKES = 14;
const RINGS = [110, 190, 280, 380, 500];

const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [(CX + r * Math.cos(a)).toFixed(1), (CY + r * Math.sin(a)).toFixed(1)];
};

const spokes = Array.from({ length: SPOKES }, (_, i) => {
  const [x, y] = polar(760, -90 + (i * 360) / SPOKES);
  return `M${CX} ${CY}L${x} ${y}`;
});

const rings = RINGS.map((r) =>
  Array.from({ length: SPOKES }, (_, i) => {
    const a1 = -90 + (i * 360) / SPOKES;
    const a2 = a1 + 360 / SPOKES;
    const [x1, y1] = polar(r, a1);
    const [x2, y2] = polar(r, a2);
    const [qx, qy] = polar(r * 0.86, a1 + 180 / SPOKES);
    return `${i ? "" : `M${x1} ${y1}`}Q${qx} ${qy} ${x2} ${y2}`;
  }).join(""),
);

const rnd = seeded(42);
const particles = Array.from({ length: 28 }, (_, i) => ({
  angle: (i / 28) * 360 + rnd() * 12,
  dist: 140 + rnd() * 220,
  size: Math.round(4 + rnd() * 10),
  red: i % 3 !== 0,
}));

const WORD = "ASSEMBLE".split("");

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const { markLoaded } = useExperience();
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      let revealed = false;
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        markLoaded();
      };

      if (prefersReducedMotion()) {
        gsap.set(gsap.utils.selector(root)(".pl-stage, .pl-hud"), { visibility: "visible" });
        const t = gsap.to(root.current, {
          autoAlpha: 0,
          duration: 0.4,
          delay: 0.5,
          onStart: reveal,
          onComplete: () => setDone(true),
        });
        return () => t.kill();
      }

      // The page is ready when fonts + window load land, but never wait more than 2.2s.
      const ready = Promise.race([
        Promise.all([
          document.fonts?.ready ?? Promise.resolve(),
          document.readyState === "complete"
            ? Promise.resolve()
            : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true })),
        ]),
        new Promise<void>((r) => setTimeout(r, 2200)),
      ]);

      const q = gsap.utils.selector(root);
      const count = { v: 0 };

      gsap.set(q(".pl-spoke, .pl-ring"), { drawSVG: "100% 100%" });
      gsap.set(q(".em-ring"), { drawSVG: "0%" });
      gsap.set(q(".em-a"), { drawSVG: "0%", fillOpacity: 0 });
      gsap.set(q(".em-ticks"), { opacity: 0 });
      gsap.set(q(".em-slash"), { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(q(".pl-char"), { yPercent: 110 });
      gsap.set(q(".pl-particle"), { scale: 0 });
      gsap.set(q(".pl-web, .pl-stage, .pl-hud"), { visibility: "visible" });

      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      tl.from(q(".pl-hud"), { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.05, ease: "power2.out" }, 0)
        .to(count, {
          v: 100,
          duration: 1.9,
          ease: "power1.inOut",
          onUpdate: () => {
            if (counter.current) counter.current.textContent = String(Math.round(count.v)).padStart(3, "0");
          },
        }, 0)
        .to(q(".pl-bar"), { scaleX: 1, duration: 1.9, ease: "power1.inOut" }, 0)
        // Threads shoot in from the edges and converge on the mark.
        .to(q(".pl-spoke"), { drawSVG: "0% 100%", duration: 0.6, stagger: { each: 0.025, from: "random" } }, 0.05)
        .to(q(".pl-ring"), { drawSVG: "0% 100%", duration: 0.55, stagger: -0.07 }, 0.35)
        .to(q(".em-ring"), { drawSVG: "100%", duration: 0.65 }, 0.45)
        .to(q(".em-ticks"), { opacity: 1, duration: 0.2 }, 0.9)
        .to(q(".em-a"), { drawSVG: "100%", duration: 0.6 }, 0.6)
        .to(q(".em-a"), { fillOpacity: 1, duration: 0.25, ease: "power2.out" }, 1.15)
        // Strike.
        .to(q(".em-slash"), { scaleX: 1, duration: 0.3, ease: "expo.out" }, 1.3)
        .fromTo(q(".pl-mark"), { x: -6 }, { x: 0, duration: 0.4, ease: "elastic.out(1.2, 0.3)" }, 1.32)
        .fromTo(q(".pl-flash"), { scale: 0.4, autoAlpha: 0.9 }, { scale: 2.4, autoAlpha: 0, duration: 0.6, ease: "power2.out" }, 1.3)
        .to(q(".pl-particle"), {
          x: (i: number) => Math.cos((particles[i].angle * Math.PI) / 180) * particles[i].dist,
          y: (i: number) => Math.sin((particles[i].angle * Math.PI) / 180) * particles[i].dist,
          duration: 0.9,
          ease: "power3.out",
        }, 1.3)
        .to(q(".pl-particle"), { scale: 1, duration: 0.2, ease: "back.out(3)" }, 1.3)
        .to(q(".pl-particle"), { scale: 0.3, opacity: 0, duration: 0.5, ease: "power2.in" }, 1.65)
        .to(q(".pl-web"), { opacity: 0.18, duration: 0.5 }, 1.35)
        .to(q(".pl-char"), { yPercent: 0, duration: 0.55, stagger: 0.035, ease: "expo.out" }, 1.4)
        .addLabel("exit", 2.0)
        .call(() => {
          ready.then(() => tl.play());
        }, [], "exit")
        .addPause("exit")
        // Exit: red curtain rises, then the whole loader peels away upward.
        .to(q(".pl-web"), { scale: 1.25, opacity: 0, duration: 0.5, ease: "power2.in" }, "exit")
        .to(q(".pl-stage"), { scale: 0.92, opacity: 0, duration: 0.45, ease: "power2.in" }, "exit")
        .fromTo(q(".pl-curtain"), { yPercent: 101 }, { yPercent: 0, duration: 0.6, ease: "cine" }, "exit+=0.1")
        .call(reveal, [], "exit+=0.65")
        .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.85, ease: "cine" }, "exit+=0.68")
        .call(() => setDone(true));

      // Absolute guarantee: whatever happens, the loader leaves.
      const hardStop = window.setTimeout(() => {
        reveal();
        tl.kill();
        setDone(true);
      }, 7000);

      return () => {
        window.clearTimeout(hardStop);
        tl.kill();
      };
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="preloader-failsafe fixed inset-0 z-[100] overflow-hidden bg-paper text-ink"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      role="status"
      aria-live="polite"
      aria-label="Loading the Avengers archive"
    >
      {/* Web threads */}
      <svg
        className="pl-web absolute inset-0 h-full w-full"
        style={{ visibility: "hidden" }}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g stroke="#0b0b0c" fill="none" strokeWidth="1.2" vectorEffect="non-scaling-stroke">
          {spokes.map((d, i) => (
            <path key={`s${i}`} className="pl-spoke" d={d} vectorEffect="non-scaling-stroke" />
          ))}
          {rings.map((d, i) => (
            <path key={`r${i}`} className="pl-ring" d={d} stroke={i === 1 ? "#e8202a" : undefined} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>

      {/* Mark + wordmark */}
      <div className="pl-stage absolute inset-0 grid place-items-center" style={{ visibility: "hidden" }}>
        <div className="flex flex-col items-center">
          <div className="relative">
            <span className="pl-flash pointer-events-none absolute inset-0 rounded-full border-[6px] border-hero opacity-0" />
            <div className="absolute top-1/2 left-1/2" aria-hidden="true">
              {particles.map((p, i) => (
                <span
                  key={i}
                  className="pl-particle absolute rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    marginLeft: -p.size / 2,
                    marginTop: -p.size / 2,
                    background: p.red ? "#e8202a" : "#0b0b0c",
                  }}
                />
              ))}
            </div>
            <div className="pl-mark relative rounded-full bg-paper p-3">
              <Emblem className="h-28 w-28 sm:h-36 sm:w-36" ring="#0b0b0c" letter="#0b0b0c" />
            </div>
          </div>
          <div className="mt-7 flex overflow-hidden bg-hero px-3 pt-2 pb-1" aria-hidden="true">
            {WORD.map((c, i) => (
              <span key={i} className="pl-char font-display inline-block text-4xl text-white sm:text-5xl">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* HUD */}
      <div className="mono-label pointer-events-none absolute inset-x-5 top-5 flex justify-between sm:inset-x-8 sm:top-7">
        <span className="pl-hud" style={{ visibility: "hidden" }}>Earth-616 // Archive</span>
        <span className="pl-hud hidden sm:inline" style={{ visibility: "hidden" }}>Calibrating multiverse</span>
      </div>
      <div className="pointer-events-none absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-7">
        <div className="flex items-end justify-between">
          <span className="pl-hud font-display text-5xl tabular-nums sm:text-6xl" style={{ visibility: "hidden" }}>
            <span ref={counter}>000</span>
            <span className="text-hero">%</span>
          </span>
          <span className="pl-hud mono-label text-right" style={{ visibility: "hidden" }}>
            Est. 1963
            <br />
            <span className="text-smoke">Fan-made tribute</span>
          </span>
        </div>
        <div className="pl-hud mt-3 h-[2px] w-full bg-ink/10" style={{ visibility: "hidden" }}>
          <div className="pl-bar h-full origin-left scale-x-0 bg-hero" />
        </div>
      </div>

      <div className="pl-curtain absolute inset-0 translate-y-full bg-hero" aria-hidden="true">
        <Emblem className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 text-white" slash="#0b0b0c" />
      </div>
    </div>
  );
}
