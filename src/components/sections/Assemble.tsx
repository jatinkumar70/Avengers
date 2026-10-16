"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { HEROES } from "@/data/heroes";
import { HeroArt } from "@/components/art/HeroArt";
import { Emblem } from "@/components/art/Emblem";
import { SpeedLines, seeded } from "@/components/art/Comic";
import { Stone } from "@/components/ui/Stone";
import { useExperience } from "@/components/providers/Experience";

const rnd = seeded(616);
const SCATTER = HEROES.map((_, i) => ({
  x: (i % 2 ? 1 : -1) * (0.55 + rnd() * 0.35),
  y: (i < 3 ? -1 : 1) * (0.5 + rnd() * 0.4),
  r: (rnd() - 0.5) * 360,
}));

const TITLE_A = "Avengers".split("");
const TITLE_B = "Assemble.".split("");

export function Assemble() {
  const root = useRef<HTMLElement>(null);
  const { openDossier } = useExperience();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      const build = (tl: gsap.core.Timeline) => {
        tl.fromTo(q(".as-bgword"), { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 0.12, duration: 1.2, ease: "power2.out" }, 0)
          .fromTo(
            q(".as-med"),
            {
              x: (i: number) => SCATTER[i].x * window.innerWidth,
              y: (i: number) => SCATTER[i].y * window.innerHeight,
              rotate: (i: number) => SCATTER[i].r,
              scale: 2,
              opacity: 0,
            },
            { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, duration: 1.1, stagger: 0.12, ease: "power3.out" },
            0.1,
          )
          .fromTo(q(".as-emblem .em-ring"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, ease: "power2.inOut" }, 0.6)
          .fromTo(q(".as-emblem .em-a"), { drawSVG: "0%", fillOpacity: 0 }, { drawSVG: "100%", duration: 0.7, ease: "power2.inOut" }, 0.8)
          .to(q(".as-emblem .em-a"), { fillOpacity: 1, duration: 0.25 }, 1.45)
          .fromTo(q(".as-emblem .em-ticks"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.3)
          .fromTo(q(".as-emblem .em-slash"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.3, ease: "expo.out" }, 1.6)
          .fromTo(q(".as-flash"), { opacity: 0 }, { opacity: 0.85, duration: 0.08, yoyo: true, repeat: 1, ease: "none" }, 1.62)
          .fromTo(q(".as-ring-spin"), { rotate: -25 }, { rotate: 0, duration: 1.9, ease: "power2.out" }, 0)
          .fromTo(q(".as-pulse"), { scale: 0.6, opacity: 0.9 }, { scale: 1.6, opacity: 0, duration: 0.8, ease: "power2.out" }, 1.62)
          .fromTo(q(".as-char"), { yPercent: 120, scale: 1.4 }, { yPercent: 0, scale: 1, duration: 0.6, stagger: 0.03, ease: "back.out(1.6)" }, 1.55)
          .fromTo(q(".as-copy"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 1.9);
        return tl;
      };

      mm.add(MQ.desktop, () => {
        build(
          gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=180%", pin: true, scrub: 1, invalidateOnRefresh: true },
          }),
        );
      });

      mm.add(MQ.mobile, () => {
        build(gsap.timeline({ scrollTrigger: { trigger: q(".as-stage")[0], start: "top 70%", once: true } }));
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="assemble"
      aria-labelledby="assemble-title"
      className="relative overflow-hidden bg-ink text-paper lg:h-[100svh]"
    >
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 60% at 70% 50%, rgba(232,32,42,0.35), transparent 70%)" }} />
        <SpeedLines className="animate-spin-rev absolute top-1/2 left-[70%] h-[200vmax] w-[200vmax] -translate-x-1/2 -translate-y-1/2 text-white/[0.06]" count={100} seed={11} inner={0.12} />
        <span className="as-bgword font-display text-outline-paper absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] whitespace-nowrap opacity-[0.12]">
          Avengers
        </span>
      </div>

      <div className="relative mx-auto grid h-full max-w-[1600px] items-center gap-12 px-5 py-24 sm:px-10 lg:grid-cols-[1fr_1.15fr] lg:py-0">
        {/* Copy */}
        <div className="relative z-10 order-2 lg:order-1">
          <p className="as-copy mono-label mb-6 flex items-center gap-3 text-white/80">
            <span className="h-px w-10 bg-hero" aria-hidden="true" />
            02 — The Team
          </p>
          <h2 id="assemble-title" className="font-display text-[clamp(4rem,10.5vw,11rem)] leading-[0.82]" aria-label="Avengers Assemble">
            <span className="split-line flex" aria-hidden="true">
              {TITLE_A.map((c, i) => (
                <span key={i} className="as-char inline-block">
                  {c}
                </span>
              ))}
            </span>
            <span className="split-line flex text-hero" aria-hidden="true">
              {TITLE_B.map((c, i) => (
                <span key={i} className="as-char inline-block">
                  {c}
                </span>
              ))}
            </span>
          </h2>
          <p className="as-copy mt-8 max-w-[42ch] text-lg leading-snug text-white/80">
            No single hero could stand against Loki. So in September 1963, five of them stood together — and the world got
            a team that keeps answering the call, roster after roster.
          </p>
          <div className="as-copy mt-8 border-t border-white/15 pt-6">
            <p className="mono-label text-white/60">Founding roster · The Avengers #1</p>
            <p className="mt-2 text-base font-semibold tracking-wide">Iron Man · Thor · Hulk · Ant-Man · The Wasp</p>
            <p className="mono-label mt-4 text-white/60">Thawed out and joined · The Avengers #4 (1964)</p>
            <p className="mt-2 text-base font-semibold tracking-wide">Captain America</p>
          </div>
          <div className="as-copy mt-8">
            <Stone id="power" />
          </div>
        </div>

        {/* Formation */}
        <div className="as-stage relative order-1 mx-auto aspect-square w-full max-w-[min(92vw,82svh)] lg:order-2">
          <div className="as-ring-spin absolute inset-0">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(251,250,247,0.15)" strokeWidth="0.25" strokeDasharray="0.6 1.4" />
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(251,250,247,0.08)" strokeWidth="0.2" />
            </svg>
            {HEROES.map((h, i) => {
              const a = ((-90 + i * 60) * Math.PI) / 180;
              const left = 50 + Math.cos(a) * 38;
              const top = 50 + Math.sin(a) * 38;
              return (
                <div
                  key={h.id}
                  className="absolute h-[24%] w-[24%] -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${left.toFixed(2)}%`, top: `${top.toFixed(2)}%` }}
                >
                  <button
                    type="button"
                    onClick={() => openDossier(h.id)}
                    data-cursor={h.name.split(" ")[0]}
                    aria-label={`Open ${h.name}'s dossier`}
                    className="as-med group relative block h-full w-full"
                  >
                    <span className="block h-full w-full overflow-hidden rounded-full border-[3px] border-paper bg-ink shadow-[0_0_0_6px_rgba(11,11,12,1),0_0_40px_rgba(232,32,42,0.35)] transition-transform duration-500 group-hover:scale-110">
                      <HeroArt hero={h.id} decorative className="h-full w-full scale-[1.35] transition-transform duration-700 group-hover:scale-150" />
                    </span>
                    <span className="mono-label absolute top-full left-1/2 mt-2 -translate-x-1/2 text-[0.55rem] whitespace-nowrap text-white/70 transition-colors group-hover:text-white sm:text-[0.62rem]">
                      {h.name}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
          <span className="as-pulse pointer-events-none absolute top-1/2 left-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-hero opacity-0" aria-hidden="true" />
          <div className="as-emblem absolute top-1/2 left-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2">
            <Emblem className="h-full w-full" ring="#fbfaf7" letter="#fbfaf7" title="The Assemble emblem" />
          </div>
        </div>
      </div>

      <div className="as-flash pointer-events-none absolute inset-0 bg-hero opacity-0" aria-hidden="true" />
    </section>
  );
}
