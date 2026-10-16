"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { MOMENTS, heroById } from "@/data/heroes";
import { HeroArt } from "@/components/art/HeroArt";
import { Stone } from "@/components/ui/Stone";
import { cn } from "@/lib/cn";

const DIGITS = Array.from({ length: 10 }, (_, i) => i);

/** Odometer: each digit is a 0–9 column translated into place. */
function Odometer({ year }: { year: string }) {
  return (
    <span className="flex" aria-hidden="true">
      {year.split("").map((d, i) => (
        <span key={i} className="relative block h-[1em] overflow-hidden leading-none">
          <span className="og-col block" style={{ transform: `translateY(-${Number(d) * 10}%)` }}>
            {DIGITS.map((n) => (
              <span key={n} className="block h-[1em] leading-none">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

export function Origins() {
  const root = useRef<HTMLElement>(null);
  const yearLabel = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const cols = q<HTMLElement>(".og-col");
      const reduce = prefersReducedMotion();

      const setYear = (year: string, title: string) => {
        year.split("").forEach((d, i) => {
          gsap.to(cols[i], { yPercent: -Number(d) * 10, y: 0, duration: reduce ? 0 : 1.1, delay: i * 0.06, ease: "expo.out", overwrite: true });
        });
        if (yearLabel.current) yearLabel.current.textContent = title;
      };
      // Hand transform control to GSAP (the inline style was only the SSR fallback).
      cols.forEach((c, i) => {
        c.style.transform = "";
        gsap.set(c, { yPercent: -Number(MOMENTS[0].year[i]) * 10 });
      });

      const cards = q<HTMLElement>(".og-card");
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: q(".og-item")[i],
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            card.classList.toggle("is-active", self.isActive);
            if (self.isActive) setYear(MOMENTS[i].year, MOMENTS[i].issue);
          },
        });
      });

      if (reduce) return;

      gsap.fromTo(
        q(".og-progress"),
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: q(".og-list")[0], start: "top 55%", end: "bottom 55%", scrub: true } },
      );

      cards.forEach((card) => {
        const c = gsap.utils.selector(card);
        gsap
          .timeline({ scrollTrigger: { trigger: card, start: "top 82%", once: true } })
          .fromTo(card, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "cine", clearProps: "clipPath" })
          .fromTo(c(".og-thumb"), { scale: 1.3, rotate: -6 }, { scale: 1, rotate: 0, duration: 1.3, ease: "expo.out" }, 0)
          .fromTo(c(".og-text > *"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.8 }, 0.25);
      });

      gsap.from(q(".og-head > *"), {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="origins" aria-label="Origins" className="relative bg-ink text-paper">
      <div className="halftone pointer-events-none absolute inset-0 text-white/[0.04]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-24 sm:px-10 lg:py-0">
        {/* Heading (mobile: scrolls away; desktop: lives in the sticky column) */}
        <div className="og-head lg:hidden">
          <p className="mono-label flex items-center gap-3 text-white/70">
            <span className="h-px w-10 bg-hero" aria-hidden="true" />
            04 — Origins
          </p>
          <h2 className="font-display mt-4 text-[clamp(2.6rem,9vw,4.5rem)] leading-[0.9]">
            Every legend has <span className="text-hero">issue #1.</span>
          </h2>
        </div>
        <div className="mt-10 lg:mt-0 lg:grid lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Sticky year */}
        <div className="sticky top-0 z-10 -mx-5 mb-10 bg-ink/90 px-5 pt-4 pb-4 backdrop-blur lg:mb-0 lg:self-start sm:-mx-10 sm:px-10 lg:top-0 lg:mx-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
          <div className="og-head hidden lg:block">
            <p className="mono-label flex items-center gap-3 text-white/70">
              <span className="h-px w-10 bg-hero" aria-hidden="true" />
              04 — Origins
            </p>
            <h2 className="font-display mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.9] lg:mt-6">
              Every legend has <span className="text-hero">issue #1.</span>
            </h2>
          </div>
          <div className="mt-2 flex items-end gap-4 lg:mt-10 lg:block">
            <p className="font-display text-[clamp(3.6rem,16vw,17rem)] leading-none text-paper" aria-hidden="true">
              <Odometer year={MOMENTS[0].year} />
            </p>
            <p className="mono-label pb-3 text-hero lg:mt-4 lg:pb-0" aria-live="polite">
              <span ref={yearLabel}>{MOMENTS[0].issue}</span>
            </p>
          </div>
        </div>

        {/* Moments */}
        <ol className="og-list relative space-y-10 lg:space-y-0 lg:py-[30svh]">
          <span className="absolute top-0 bottom-0 -left-5 hidden w-[2px] bg-white/10 lg:block" aria-hidden="true">
            <span className="og-progress absolute inset-0 origin-top bg-hero" />
          </span>
          {MOMENTS.map((m, i) => {
            const hero = heroById(m.hero);
            return (
              <li key={m.issue} className="og-item lg:flex lg:min-h-[70svh] lg:items-center">
                <article
                  className={cn(
                    "og-card group relative grid w-full grid-cols-[minmax(0,7rem)_1fr] gap-4 border-[3px] border-paper bg-paper p-3 text-ink shadow-[10px_10px_0_#e8202a] transition-[opacity,transform] duration-700 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-6 sm:p-4 lg:opacity-40 lg:[&.is-active]:opacity-100 lg:[&.is-active]:-translate-y-2",
                  )}
                >
                  <div className="relative self-start overflow-hidden border-2 border-ink">
                    <div className="og-thumb aspect-[4/5] w-full">
                      <HeroArt hero={hero.id} decorative className="h-full w-full" />
                    </div>
                    <span className="mono-label absolute top-0 left-0 bg-hero px-1.5 py-0.5 text-[0.55rem] text-white">{m.year}</span>
                  </div>
                  <div className="og-text flex flex-col justify-center py-1">
                    <p className="mono-label text-hero">{m.issue}</p>
                    <h3 className="font-display mt-2 text-[clamp(1.8rem,3.4vw,3.2rem)] leading-[0.9]">{m.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/80 sm:text-base">{m.body}</p>
                    <p className="mono-label mt-4 flex items-center gap-2 text-smoke">
                      <span className="inline-block h-2 w-2 rounded-full" style={{ background: hero.color }} />
                      {hero.name}
                      {i === MOMENTS.length - 1 && <Stone id="soul" className="ml-2" />}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
        </div>
      </div>
    </section>
  );
}
