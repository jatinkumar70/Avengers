"use client";

import { useRef } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Emblem } from "@/components/art/Emblem";
import { SpeedLines } from "@/components/art/Comic";
import { Magnetic } from "@/components/ui/Magnetic";
import { Gem } from "@/components/ui/Stone";
import { useExperience } from "@/components/providers/Experience";
import { STONES } from "@/data/stones";

export function Finale() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo, stones } = useExperience();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", end: "center center", scrub: 1 } })
          .fromTo(q(".fn-line-a"), { xPercent: -40 }, { xPercent: 0, ease: "none" }, 0)
          .fromTo(q(".fn-line-b"), { xPercent: 40 }, { xPercent: 0, ease: "none" }, 0)
          .fromTo(q(".fn-emblem"), { rotate: -120, scale: 0.4 }, { rotate: 0, scale: 1, ease: "none" }, 0);
        gsap.from(q(".fn-fade"), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.9,
          scrollTrigger: { trigger: q(".fn-ctas")[0], start: "top 92%", once: true },
        });
      });
      mm.add(MQ.desktop, () => {
        gsap.to(q(".fn-lines"), { rotate: 30, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const found = stones.length;

  return (
    <section ref={root} aria-labelledby="finale-title" className="relative overflow-hidden bg-paper py-28 lg:py-44">
      <SpeedLines className="fn-lines pointer-events-none absolute top-1/2 left-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 text-ink/[0.06]" count={110} seed={77} inner={0.2} />
      <div className="relative mx-auto max-w-[1600px] px-5 text-center sm:px-10">
        <h2 id="finale-title" className="font-display text-[clamp(4rem,17vw,19rem)] leading-[0.8]">
          <span className="fn-line-a block">Whatever</span>
          <span className="fn-line-b flex items-center justify-center gap-[2vw]">
            <span className="text-hero">it</span>
            <Emblem className="fn-emblem inline-block h-[0.8em] w-[0.8em] text-ink" />
            <span className="text-outline-ink">takes.</span>
          </span>
        </h2>

        <div className="fn-ctas mt-14 flex flex-wrap items-center justify-center gap-4">
          <Magnetic className="fn-fade">
            <button
              type="button"
              onClick={() => scrollTo(0)}
              data-cursor="Again"
              className="group inline-flex items-center gap-3 rounded-full bg-hero py-2 pr-2 pl-6 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-ink"
            >
              Assemble again
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-hero transition-transform duration-500 group-hover:-rotate-180">
                <ArrowUp size={18} />
              </span>
            </button>
          </Magnetic>
          <a
            href="#dossier"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#dossier");
            }}
            className="fn-fade group inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-4 text-sm font-bold tracking-wide uppercase transition-colors hover:bg-ink hover:text-paper"
          >
            Pick your hero <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="fn-fade mx-auto mt-14 inline-flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-ink/25 px-6 py-5">
          <div className="flex gap-2" aria-hidden="true">
            {STONES.map((s) => (
              <Gem
                key={s.id}
                color={s.color}
                glow={s.glow}
                className={stones.includes(s.id) ? "h-6 w-6" : "h-6 w-6 opacity-20 grayscale"}
              />
            ))}
          </div>
          <p className="mono-label text-ink/80" aria-live="polite">
            {found === 0 && "Six Infinity Stones are hidden on this page."}
            {found > 0 && found < 6 && `${found}/6 stones found — the rest hide in plain sight.`}
            {found === 6 && "Perfectly balanced."}
          </p>
        </div>
      </div>
    </section>
  );
}
