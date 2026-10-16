"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { gsap, useGSAP, SplitText, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { HEROES, heroById, type HeroId } from "@/data/heroes";
import { HeroArt } from "@/components/art/HeroArt";
import { CornerMarks, SfxBurst } from "@/components/art/Comic";
import { Stone } from "@/components/ui/Stone";
import { RevealText } from "@/components/ui/RevealText";
import { useExperience } from "@/components/providers/Experience";
import { cn } from "@/lib/cn";

const TABS = ["Powers", "Profile", "Universe"] as const;
type Tab = (typeof TABS)[number];

export function Dossier() {
  const root = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wipeTl = useRef<gsap.core.Timeline | null>(null);
  const { dossierHero, setDossierHero } = useExperience();
  const [shown, setShown] = useState<HeroId>(dossierHero);
  const [tab, setTab] = useState<Tab>("Powers");
  const firstReveal = useRef(true);
  const hero = heroById(shown);
  const selIndex = HEROES.findIndex((h) => h.id === dossierHero);

  // Phase 1 — cover the stage with the incoming hero's color, then swap content.
  useEffect(() => {
    if (dossierHero === shown) return;
    if (prefersReducedMotion()) {
      setShown(dossierHero);
      return;
    }
    const q = gsap.utils.selector(root);
    const next = heroById(dossierHero);
    wipeTl.current?.kill();
    wipeTl.current = gsap
      .timeline({ onComplete: () => setShown(dossierHero) })
      .set(q(".ds-wipe"), { backgroundColor: next.color })
      .fromTo(q(".ds-wipe"), { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "cine" })
      .to(q(".ds-out"), { autoAlpha: 0, y: -16, duration: 0.3, stagger: 0.03, ease: "power2.in" }, 0);
  }, [dossierHero, shown]);

  // Phase 2 — reveal the new hero.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) {
        gsap.set(q(".ds-bar"), { scaleX: (_: number, el: HTMLElement) => Number(el.dataset.value) / 100 });
        return;
      }

      const name = q(".ds-name")[0] as HTMLElement;
      const split = SplitText.create(name, { type: "chars", mask: "chars" });

      const tl = gsap.timeline({ paused: firstReveal.current });
      tl.to(q(".ds-wipe"), { clipPath: "inset(0% 0% 0% 100%)", duration: 0.65, ease: "cine" }, 0)
        .fromTo(q(".ds-art"), { scale: 1.25 }, { scale: 1, duration: 1.2, ease: "expo.out" }, 0)
        .fromTo(split.chars, { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.03, ease: "expo.out" }, 0.1)
        .fromTo(q(".ds-out"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }, 0.15)
        .fromTo(q(".ds-sfx"), { scale: 0, rotate: -30 }, { scale: 1, rotate: -8, duration: 0.6, ease: "back.out(2.5)" }, 0.45);

      if (firstReveal.current) {
        firstReveal.current = false;
        gsap.set(q(".ds-wipe"), { clipPath: "inset(0% 0% 0% 0%)", backgroundColor: hero.color });
        ScrollTrigger.create({ trigger: q(".ds-stage")[0], start: "top 75%", once: true, onEnter: () => tl.play() });
      }

      return () => split.revert();
    },
    { scope: root, dependencies: [shown], revertOnUpdate: false },
  );

  // Bars + chips re-run when the hero or tab changes.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) return;
      // Plays immediately if the stage is already on screen, otherwise when it arrives.
      const seen = () => ({ trigger: q(".ds-stage")[0], start: "top 75%", once: true });
      gsap.fromTo(
        q(".ds-bar"),
        { scaleX: 0 },
        { scaleX: (_: number, el: HTMLElement) => Number(el.dataset.value) / 100, duration: 1.2, stagger: 0.07, ease: "expo.out", delay: 0.25, scrollTrigger: seen() },
      );
      q<HTMLElement>(".ds-val").forEach((el) => {
        const o = { v: 0 };
        gsap.to(o, { v: Number(el.dataset.value), duration: 1.2, delay: 0.25, ease: "expo.out", scrollTrigger: seen(), onUpdate: () => (el.textContent = String(Math.round(o.v))) });
      });
      gsap.fromTo(q(".ds-chip"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.5, delay: 0.2, scrollTrigger: seen() });
    },
    { scope: root, dependencies: [shown, tab] },
  );

  const select = (i: number) => {
    const idx = (i + HEROES.length) % HEROES.length;
    setDossierHero(HEROES[idx].id);
    return idx;
  };

  const onListKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let idx: number | null = null;
    if (e.key in map) idx = select(selIndex + map[e.key]);
    if (e.key === "Home") idx = select(0);
    if (e.key === "End") idx = select(HEROES.length - 1);
    if (idx !== null) {
      e.preventDefault();
      tabRefs.current[idx]?.focus();
      tabRefs.current[idx]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  };

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.indexOf(tab);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const next = TABS[(i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length];
      setTab(next);
      document.getElementById(`ds-tab-${next}`)?.focus();
    }
  };

  return (
    <section ref={root} id="dossier" aria-labelledby="dossier-title" className="paper-grain relative overflow-hidden bg-paper py-24 lg:py-36">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-10">
        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 lg:mb-16 lg:flex-row lg:items-end">
          <div>
            <p className="mono-label mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-ink" aria-hidden="true" />
              03 — Dossier
            </p>
            <RevealText as="h2" by="lines" className="font-display text-[clamp(3.6rem,9vw,9.5rem)] leading-[0.84]">
              <span id="dossier-title">
                Choose your <span className="text-hero">hero.</span>
              </span>
            </RevealText>
          </div>
          <p className="max-w-[38ch] text-lg leading-snug text-ink/75">
            Select a file to explore abilities, personality and where each legend fits in the universe. Arrow keys work
            too.
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
          {/* Hero list */}
          <div>
          <div
            role="tablist"
            aria-label="Heroes"
            aria-orientation="vertical"
            onKeyDown={onListKey}
            className="no-scrollbar -mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {HEROES.map((h, i) => {
              const active = h.id === dossierHero;
              return (
                <button
                  key={h.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`ds-hero-${h.id}`}
                  aria-selected={active}
                  aria-controls="ds-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => setDossierHero(h.id)}
                  className={cn(
                    "group relative flex shrink-0 snap-start items-center gap-3 overflow-hidden rounded-full border-2 border-ink px-4 py-2 text-left transition-colors duration-300 lg:rounded-none lg:border-0 lg:border-b-2 lg:border-ink/10 lg:px-3 lg:py-4",
                    active ? "bg-ink text-paper lg:bg-hero lg:text-white" : "hover:bg-ink/5",
                  )}
                >
                  <span className={cn("mono-label hidden lg:inline", active ? "text-white/80" : "text-smoke")}>{h.index}</span>
                  <span
                    className="h-3 w-3 shrink-0 rounded-full border-2 border-current"
                    style={{ background: h.color }}
                    aria-hidden="true"
                  />
                  <span className="font-display text-lg whitespace-nowrap transition-transform duration-500 lg:text-[2rem] lg:group-hover:translate-x-2">
                    {h.name}
                  </span>
                  {active && <ArrowRight size={18} className="ml-auto hidden lg:block" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
            <div className="mt-6 hidden items-center gap-2 lg:flex">
              <button
                type="button"
                onClick={() => select(selIndex - 1)}
                aria-label="Previous hero"
                className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink transition-colors hover:bg-ink hover:text-paper"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => select(selIndex + 1)}
                aria-label="Next hero"
                className="grid h-12 w-12 place-items-center rounded-full border-2 border-ink transition-colors hover:bg-ink hover:text-paper"
              >
                <ArrowRight size={18} />
              </button>
              <span className="mono-label ml-3 text-smoke tabular-nums">
                {String(selIndex + 1).padStart(2, "0")} / 06
              </span>
            </div>
          </div>

          {/* Stage */}
          <div className="ds-stage relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden border-[3px] border-ink bg-ink shadow-[12px_12px_0_#0b0b0c]">
              <div className="ds-art h-full w-full">
                <HeroArt hero={hero.id} className="h-full w-full" />
              </div>
              {/* Scanner HUD */}
              <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <CornerMarks className="m-4 text-white/80" />
                <div className="absolute inset-x-0 top-0 h-1/3 animate-[scan_3.6s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                <p className="mono-label absolute top-5 left-5 text-white/85">Subject {hero.index}</p>
                <p className="mono-label absolute top-5 right-5 flex items-center gap-2 text-white/85">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-hero" /> Live
                </p>
                <p className="mono-label absolute bottom-5 left-5 border-2 border-hero bg-ink/70 px-2 py-1 text-hero -rotate-6">
                  Classified
                </p>
              </div>
              <div className="ds-wipe absolute inset-0" style={{ clipPath: "inset(0% 0% 0% 100%)" }} aria-hidden="true">
                <div className="halftone h-full w-full text-black/20" />
              </div>
            </div>
            <div className="ds-sfx pointer-events-none absolute -top-8 -right-2 w-32 sm:right-6 lg:-right-8 lg:w-40" aria-hidden="true">
              <SfxBurst text={hero.sfx} seed={selIndex + 30} />
            </div>
          </div>

          {/* Details */}
          <div id="ds-panel" role="tabpanel" aria-labelledby={`ds-hero-${hero.id}`} className="relative">
            <p className="ds-out mono-label flex items-center gap-2" style={{ color: hero.id === "black-panther" ? "#6d48d9" : hero.color }}>
              <span className="inline-block h-2.5 w-2.5" style={{ background: hero.color }} />
              {hero.title}
            </p>
            <h3 key={hero.id} className="ds-name font-display mt-3 text-[clamp(3.2rem,6.4vw,6.4rem)] leading-[0.86]">{hero.name}</h3>
            <p className="ds-out mono-label mt-3 text-smoke">Identity · {hero.alias}</p>

            <div role="tablist" aria-label="Dossier sections" onKeyDown={onTabKey} className="ds-out mt-8 flex gap-1 border-b-2 border-ink">
              {TABS.map((t) => (
                <button
                  key={t}
                  id={`ds-tab-${t}`}
                  role="tab"
                  aria-selected={tab === t}
                  aria-controls={`ds-sub-${t}`}
                  tabIndex={tab === t ? 0 : -1}
                  onClick={() => setTab(t)}
                  className={cn(
                    "relative -mb-[2px] px-4 py-2.5 text-sm font-bold tracking-wide uppercase transition-colors",
                    tab === t ? "bg-ink text-paper" : "text-ink/60 hover:text-ink",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="ds-out min-h-[300px] pt-7" role="tabpanel" id={`ds-sub-${tab}`} aria-labelledby={`ds-tab-${tab}`}>
              {tab === "Powers" && (
                <div>
                  <ul className="space-y-4" aria-label="Power ratings">
                    {hero.powers.map((p) => (
                      <li key={p.label}>
                        <div className="mb-1.5 flex items-baseline justify-between">
                          <span className="text-sm font-bold tracking-wide uppercase">{p.label}</span>
                          <span className="font-display text-2xl tabular-nums">
                            <span className="ds-val" data-value={p.value}>
                              {p.value}
                            </span>
                            <span className="text-smoke text-base">/100</span>
                          </span>
                        </div>
                        <div className="h-3 w-full border-2 border-ink bg-paper-2" role="presentation">
                          <div className="ds-bar h-full origin-left" data-value={p.value} style={{ background: hero.color, transform: `scaleX(${p.value / 100})` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-7 flex flex-wrap gap-2" aria-label="Signature abilities">
                    {hero.abilities.map((a) => (
                      <li key={a} className="ds-chip rounded-full bg-ink px-3 py-1.5 text-xs font-bold tracking-wide text-paper uppercase">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "Profile" && (
                <div>
                  <p className="text-lg leading-relaxed text-ink/85">{hero.bio}</p>
                  <p className="mono-label mt-8 mb-3 text-smoke">Personality</p>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {hero.personality.map((t, i) => (
                      <li key={t} className={cn("ds-chip font-display text-4xl lg:text-5xl", i % 2 ? "text-outline-ink" : "")}>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "Universe" && (
                <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {[
                    ["Base of operations", hero.universe.base],
                    ["Origin", hero.universe.origin],
                    ["First appearance", `${hero.firstAppearance.issue} · ${hero.firstAppearance.date}`],
                    ["Created by", hero.creators],
                  ].map(([k, v]) => (
                    <div key={k} className="ds-chip border-t-2 border-ink pt-3">
                      <dt className="mono-label text-smoke">{k}</dt>
                      <dd className="mt-1.5 text-base font-semibold">{v}</dd>
                    </div>
                  ))}
                  <div className="ds-chip border-t-2 border-ink pt-3 sm:col-span-2">
                    <dt className="mono-label text-smoke">Affiliations</dt>
                    <dd className="mt-2 flex flex-wrap items-center gap-2">
                      {hero.universe.affiliations.map((a) => (
                        <span key={a} className="rounded-full border-2 border-ink px-3 py-1 text-xs font-bold uppercase">
                          {a}
                        </span>
                      ))}
                      <Stone id="reality" className="ml-1" />
                    </dd>
                  </div>
                </dl>
              )}
            </div>

            <blockquote className="ds-out mt-8 flex gap-3 border-l-4 pl-4" style={{ borderColor: hero.color }}>
              <Quote size={20} className="mt-1 shrink-0 text-hero" aria-hidden="true" />
              <p className="text-xl leading-snug font-semibold italic">{hero.quote}</p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
