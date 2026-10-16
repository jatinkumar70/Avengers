"use client";

import { useRef } from "react";
import { ArrowRight, MoveRight } from "lucide-react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { HEROES, type Hero } from "@/data/heroes";
import { HeroArt } from "@/components/art/HeroArt";
import { SfxBurst, CornerMarks } from "@/components/art/Comic";
import { TiltCard } from "@/components/ui/TiltCard";
import { Stone } from "@/components/ui/Stone";
import { useExperience } from "@/components/providers/Experience";
import { cn } from "@/lib/cn";

function HeroPanel({ hero, i }: { hero: Hero; i: number }) {
  const { openDossier } = useExperience();
  const flip = i % 2 === 1;
  // "Captain America" → Captain / America; "Spider-Man" → Spider- / Man
  const [first, second] = hero.name.includes("-")
    ? [hero.name.slice(0, hero.name.indexOf("-") + 1), hero.name.slice(hero.name.indexOf("-") + 1)]
    : hero.name.split(" ");

  return (
    <article
      aria-labelledby={`roster-${hero.id}`}
      className="rs-panel relative flex shrink-0 flex-col gap-10 px-5 py-16 sm:px-10 lg:h-[100svh] lg:w-[100vw] lg:flex-row lg:items-center lg:gap-[5vw] lg:px-[6vw] lg:py-0"
      style={{ ["--hero" as string]: hero.color, ["--accent" as string]: hero.accent }}
    >
      {/* Giant index numeral */}
      <span
        aria-hidden="true"
        className="rs-num font-display text-outline-ink pointer-events-none absolute top-6 right-4 text-[34vw] leading-none opacity-[0.08] select-none lg:top-auto lg:right-auto lg:bottom-[-4vw] lg:left-[38vw] lg:text-[30vw]"
      >
        {hero.index}
      </span>

      {/* Copy */}
      <div className={cn("relative z-10 lg:w-[38%]", flip && "lg:order-2")}>
        <p className="rs-meta mono-label mb-5 flex items-center gap-3">
          <span className="inline-block h-3 w-3" style={{ background: hero.color }} />
          File {hero.index} / 06 — {hero.title}
        </p>
        <h3 id={`roster-${hero.id}`} className="font-display text-[clamp(4rem,10vw,10.5rem)] leading-[0.82]">
          <span className="split-line block">
            <span className="rs-name block">{first}</span>
          </span>
          {second && (
            <span className="split-line block">
              <span className="rs-name block" style={{ color: hero.id === "black-panther" ? hero.accent : hero.color }}>
                {second}
              </span>
            </span>
          )}
        </h3>
        <p className="rs-meta mono-label mt-5 text-smoke">a.k.a. {hero.alias}</p>
        <p className="rs-meta mt-6 max-w-[34ch] text-lg leading-snug font-medium lg:text-xl">{hero.tagline}</p>
        <ul className="rs-meta mt-6 flex flex-wrap gap-2" aria-label={`${hero.name} abilities`}>
          {hero.abilities.slice(0, 3).map((a) => (
            <li key={a} className="rounded-full border-2 border-ink px-3 py-1 text-xs font-bold tracking-wide uppercase">
              {a}
            </li>
          ))}
        </ul>
        <div className="rs-meta mt-8 flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => openDossier(hero.id)}
            data-cursor="Dossier"
            className="group inline-flex items-center gap-2 border-b-2 border-ink pb-1 text-sm font-bold tracking-wide uppercase transition-colors hover:border-hero hover:text-hero"
          >
            Open dossier
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
          <span className="mono-label text-smoke">
            Debut · {hero.firstAppearance.issue}
          </span>
          {hero.id === "doctor-strange" && <Stone id="time" />}
        </div>
      </div>

      {/* Art */}
      <div className={cn("relative z-0 lg:w-[42%]", flip && "lg:order-1")}>
        <div className="relative mx-auto w-full max-w-[560px] lg:w-fit lg:max-w-none">
        <div aria-hidden="true" className="rs-block absolute -inset-4 translate-x-6 translate-y-6 lg:-inset-6 lg:translate-x-10 lg:translate-y-10" style={{ background: hero.color }}>
          <div className="halftone h-full w-full text-white/10" />
        </div>
        <TiltCard className="rs-card relative aspect-[4/5] w-full lg:h-[68svh] lg:w-auto">
          <div className="rs-clip relative h-full w-full overflow-hidden border-[3px] border-ink bg-ink">
            <div className="rs-art h-full w-full">
              <HeroArt hero={hero.id} className="block h-full w-full" />
            </div>
            <CornerMarks className="m-3 text-white/70" />
            <p className="mono-label absolute bottom-3 left-3 bg-ink px-2 py-1 text-white" data-z="40">
              #{hero.index} · {hero.firstAppearance.date}
            </p>
          </div>
          <div data-z="80" className="rs-sfx pointer-events-none absolute -top-10 -right-6 w-32 lg:-right-12 lg:w-40" aria-hidden="true">
            <SfxBurst text={hero.sfx} seed={i * 5 + 1} fill={i % 2 ? "#f5c518" : "#fbfaf7"} />
          </div>
        </TiltCard>
        </div>
        <blockquote className="rs-meta mt-10 max-w-[40ch] border-l-4 pl-4 text-base italic lg:hidden" style={{ borderColor: hero.color }}>
          &ldquo;{hero.quote}&rdquo;
        </blockquote>
      </div>

      {/* Vertical quote (desktop) */}
      <p
        className={cn(
          "rs-meta mono-label absolute top-1/2 hidden max-w-[60svh] -translate-y-1/2 text-smoke [writing-mode:vertical-rl]",
          !flip && "lg:block",
          flip ? "left-[2.2vw] rotate-180" : "right-[2.2vw]",
        )}
      >
        &ldquo;{hero.quote}&rdquo;
      </p>
    </article>
  );
}

export function Roster() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Desktop: pinned horizontal "film strip".
      mm.add(MQ.desktop, () => {
        const track = q(".rs-track")[0] as HTMLElement;
        const distance = () => track.scrollWidth - window.innerWidth;

        const scroller = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              gsap.set(q(".rs-progress"), { scaleX: self.progress });
              const idx = Math.min(HEROES.length, Math.max(1, Math.round(self.progress * HEROES.length + 0.4)));
              const counter = q(".rs-counter")[0];
              if (counter) counter.textContent = String(idx).padStart(2, "0");
            },
          },
        });

        q<HTMLElement>(".rs-panel").forEach((panel) => {
          const p = gsap.utils.selector(panel);
          const tl = gsap.timeline({
            scrollTrigger: { trigger: panel, containerAnimation: scroller, start: "left 75%", toggleActions: "play none none reverse" },
          });
          tl.fromTo(p(".rs-clip"), { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "cine" })
            .fromTo(p(".rs-art"), { scale: 1.35 }, { scale: 1, duration: 1.6, ease: "expo.out" }, 0)
            .fromTo(p(".rs-block"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 1, ease: "cine" }, 0.1)
            .fromTo(p(".rs-name"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.1, ease: "expo.out" }, 0.15)
            .fromTo(p(".rs-meta"), { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.06 }, 0.35)
            .fromTo(p(".rs-sfx"), { scale: 0, rotate: -40 }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2.5)" }, 0.8);

          // Parallax drift inside the strip.
          gsap.fromTo(
            p(".rs-num"),
            { xPercent: 30 },
            {
              xPercent: -30,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: scroller, start: "left right", end: "right left", scrub: true },
            },
          );
        });

        gsap.from(q(".rs-intro-line"), {
          yPercent: 110,
          stagger: 0.1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        });
      });

      // Mobile / tablet: vertical, each file reveals as it enters.
      mm.add(MQ.mobile, () => {
        gsap.from(q(".rs-intro-line"), {
          yPercent: 110,
          stagger: 0.1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });
        q<HTMLElement>(".rs-panel").forEach((panel) => {
          const p = gsap.utils.selector(panel);
          gsap
            .timeline({ scrollTrigger: { trigger: panel, start: "top 75%", once: true } })
            .fromTo(p(".rs-name"), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.08, ease: "expo.out" })
            .fromTo(p(".rs-meta"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05 }, 0.2);
          gsap
            .timeline({ scrollTrigger: { trigger: p(".rs-card")[0], start: "top 85%", once: true } })
            .fromTo(p(".rs-clip"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "cine" })
            .fromTo(p(".rs-art"), { scale: 1.3 }, { scale: 1, duration: 1.4, ease: "expo.out" }, 0)
            .fromTo(p(".rs-sfx"), { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(2.5)" }, 0.6);
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="roster" aria-labelledby="roster-title" className="paper-grain relative overflow-hidden bg-paper">
      <div className="rs-track relative flex flex-col lg:h-[100svh] lg:w-max lg:flex-row">
        {/* Intro panel */}
        <div className="relative flex shrink-0 flex-col justify-center px-5 pt-24 pb-8 sm:px-10 lg:h-[100svh] lg:w-[72vw] lg:px-[6vw] lg:py-0">
          <p className="mono-label mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-ink" aria-hidden="true" />
            01 — The Roster
          </p>
          <h2 id="roster-title" className="font-display text-[clamp(4.5rem,14vw,15rem)] leading-[0.8]">
            <span className="split-line block">
              <span className="rs-intro-line block">Six</span>
            </span>
            <span className="split-line block">
              <span className="rs-intro-line block text-hero">Legends.</span>
            </span>
            <span className="split-line block">
              <span className="rs-intro-line text-outline-ink block">One file.</span>
            </span>
          </h2>
          <p className="mt-8 max-w-[44ch] text-lg leading-snug text-ink/80">
            Declassified from the Earth-616 archive: the armor, the webs, the hammer, the shield, the sorcery and the
            crown. Keep scrolling to flip through each file.
          </p>
          <p className="mono-label mt-10 hidden items-center gap-3 text-hero lg:flex">
            Scroll <MoveRight size={16} className="animate-pulse" />
          </p>
        </div>

        {HEROES.map((hero, i) => (
          <HeroPanel key={hero.id} hero={hero} i={i} />
        ))}
      </div>

      {/* Strip HUD (desktop) */}
      <div className="pointer-events-none absolute inset-x-[6vw] bottom-8 hidden items-center gap-6 lg:flex" aria-hidden="true">
        <span className="font-display text-3xl tabular-nums">
          <span className="rs-counter">01</span>
          <span className="text-smoke"> / 06</span>
        </span>
        <span className="relative h-[2px] flex-1 bg-ink/10">
          <span className="rs-progress absolute inset-0 origin-left scale-x-0 bg-hero" />
        </span>
        <span className="mono-label">Earth-616 Archive</span>
      </div>
    </section>
  );
}
