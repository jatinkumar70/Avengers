"use client";

import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { useExperience } from "@/components/providers/Experience";
import { HeroArt } from "@/components/art/HeroArt";
import { SfxBurst, SpeedLines } from "@/components/art/Comic";
import { Magnetic } from "@/components/ui/Magnetic";
import { Stone } from "@/components/ui/Stone";
import type { HeroId } from "@/data/heroes";
import { cn } from "@/lib/cn";

const TITLE = "AVENGERS".split("");

type PanelDef = {
  hero: HeroId;
  label: string;
  sfx: string;
  depth: number;
  rot: number;
  className: string;
  /** Scroll exit direction. */
  out: [number, number];
};

const PANELS: PanelDef[] = [
  {
    hero: "iron-man",
    label: "Iron Man",
    sfx: "WHRRR!",
    depth: 1.4,
    rot: -7,
    className: "left-[4%] top-[16%] w-[30vw] sm:w-[22vw] lg:left-[5%] lg:top-[17%] lg:w-[14vw]",
    out: [-60, -40],
  },
  {
    hero: "spider-man",
    label: "Spider-Man",
    sfx: "THWIP!",
    depth: 0.9,
    rot: 6,
    className: "right-[4%] top-[14%] w-[26vw] sm:w-[19vw] lg:right-[6%] lg:top-[13%] lg:w-[12.5vw]",
    out: [60, -50],
  },
  {
    hero: "captain-america",
    label: "Captain America — click to throw the shield",
    sfx: "KLANGG!",
    depth: 1.1,
    rot: 4,
    className: "hidden lg:block lg:left-[11%] lg:bottom-[9%] lg:w-[11.5vw]",
    out: [-60, 50],
  },
  {
    hero: "thor",
    label: "Thor — click to try lifting Mjolnir",
    sfx: "KRAKOOM!",
    depth: 1.6,
    rot: -4,
    className: "hidden lg:block lg:right-[10%] lg:bottom-[8%] lg:w-[13.5vw]",
    out: [60, 50],
  },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const thorTries = useRef(0);
  const { loaded, scrollTo } = useExperience();

  // Scroll choreography + mouse depth. Built once; the intro waits for the loader.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Hidden start states (the preloader covers the page while these apply).
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(q(".h-char-in"), { yPercent: 115, rotate: 8 });
        gsap.set(q(".hero-disc"), { clipPath: "circle(0% at 50% 50%)" });
        gsap.set(q(".ret-line"), { drawSVG: "0%" });
        gsap.set(q(".panel-clip"), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(q(".h-fade"), { autoAlpha: 0, y: 24 });
        gsap.set(q(".hero-lines"), { scale: 0.6, autoAlpha: 0 });
      });

      mm.add(
        { desktop: MQ.desktop, mobile: MQ.mobile },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          const disc = q(".hero-disc-wrap")[0] as HTMLElement;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: desktop ? "+=110%" : "+=70%",
              pin: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
            defaults: { ease: "none" },
          });

          tl.to(q(".h-char"), {
            xPercent: (i: number) => (i - (TITLE.length - 1) / 2) * (desktop ? 55 : 30),
            yPercent: (i: number) => (i % 2 ? -1 : 1) * 30,
            stagger: { each: 0.02, from: "center" },
          }, 0)
            // Letters stay solid while they scatter, then vanish as the red takes over.
            .to(q(".h-char"), { opacity: 0, duration: 0.45, stagger: { each: 0.02, from: "edges" } }, 0.45)
            .to(disc, {
              scale: () => (Math.hypot(window.innerWidth, window.innerHeight) / disc.offsetWidth) * 1.08,
              ease: "power2.in",
            }, 0)
            .to(q(".hero-disc .disc-emblem"), { scale: 0.4, opacity: 0, ease: "power2.in" }, 0)
            .to(q(".disc-fx"), { opacity: 0, ease: "power2.in" }, 0.2)
            .to(q(".hero-panel"), {
              xPercent: (i: number) => PANELS[i].out[0] * 4,
              yPercent: (i: number) => PANELS[i].out[1] * 4,
              rotate: (i: number) => PANELS[i].rot * 4,
              opacity: 0,
            }, 0)
            .to(q(".h-out, .hero-bg"), { opacity: 0, y: -40 }, 0)
            .to(q(".hero-616"), { xPercent: -30, opacity: 0 }, 0);

          // Mouse-driven depth on precise pointers.
          if (!desktop || !window.matchMedia("(pointer: fine)").matches) return;
          const layers = q<HTMLElement>("[data-depth]").map((el) => ({
            depth: Number(el.dataset.depth),
            x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3" }),
            y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3" }),
          }));
          const onMove = (e: PointerEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            layers.forEach((l) => {
              l.x(nx * 40 * l.depth);
              l.y(ny * 30 * l.depth);
            });
          };
          window.addEventListener("pointermove", onMove);
          return () => window.removeEventListener("pointermove", onMove);
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  // Intro — plays as the loader peels away.
  useGSAP(
    () => {
      if (!loaded || window.matchMedia(MQ.reduce).matches) return;
      const q = gsap.utils.selector(root);
      gsap
        .timeline({ delay: 0.15 })
        .to(q(".hero-disc"), { clipPath: "circle(50% at 50% 50%)", duration: 1.5, ease: "cine" }, 0)
        .to(q(".hero-lines"), { scale: 1, autoAlpha: 1, duration: 1.8, ease: "expo.out" }, 0.1)
        .to(q(".h-char-in"), { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.055, ease: "expo.out" }, 0.25)
        .to(q(".ret-line"), { drawSVG: "100%", duration: 1.2, stagger: 0.12, ease: "power2.inOut" }, 0.6)
        .to(q(".panel-clip"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, stagger: 0.12, ease: "cine", clearProps: "clipPath" }, 0.55)
        .from(q(".panel-tilt"), { rotate: (i: number) => PANELS[i].rot + 14, y: 80, duration: 1.4, stagger: 0.12, ease: "expo.out" }, 0.55)
        .to(q(".h-fade"), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: "power3.out" }, 0.9);
    },
    { scope: root, dependencies: [loaded] },
  );

  const { contextSafe } = useGSAP({ scope: root });

  const onPanel = contextSafe((i: number) => {
    const q = gsap.utils.selector(root);
    const panel = q(".panel-tilt")[i] as HTMLElement;
    const sfx = q(".panel-sfx")[i] as HTMLElement;
    const pop = (text?: string) => {
      if (text) sfx.querySelector("text")!.textContent = text;
      gsap.fromTo(sfx, { scale: 0, rotate: -20, autoAlpha: 1 }, { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(3)" });
      gsap.to(sfx, { autoAlpha: 0, scale: 0.8, delay: 0.9, duration: 0.3 });
    };
    const id = PANELS[i].hero;

    if (id === "captain-america") {
      // Boomerang throw across the hero.
      gsap
        .timeline()
        .to(panel, { x: () => window.innerWidth * 0.55, y: -120, rotate: "+=720", duration: 0.65, ease: "power2.out" })
        .to(panel, { x: 0, y: 0, rotate: "+=720", duration: 0.65, ease: "power2.in" })
        .call(() => pop("KLANGG!"))
        .fromTo(panel, { rotate: PANELS[i].rot - 8 }, { rotate: PANELS[i].rot, duration: 0.6, ease: "elastic.out(1.2, 0.3)" });
      return;
    }

    if (id === "thor") {
      thorTries.current += 1;
      if (thorTries.current < 5) {
        gsap.fromTo(panel, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(2, 0.2)" });
        pop(thorTries.current === 4 ? "ALMOST…" : "NOT WORTHY");
        return;
      }
      thorTries.current = 0;
      pop("WORTHY!");
      gsap
        .timeline()
        .to(panel, { y: -90, rotate: 0, duration: 0.5, ease: "power3.out" })
        .to(q(".hero-flash"), { autoAlpha: 0.9, duration: 0.05, repeat: 3, yoyo: true }, "<")
        .to(panel, { y: 0, rotate: PANELS[i].rot, duration: 0.8, ease: "bounce.out" });
      return;
    }

    gsap.fromTo(panel, { scale: 0.94 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.4, 0.35)" });
    pop();
  });

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-paper"
    >
      {/* Background graphics */}
      <div className="hero-bg pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="halftone absolute inset-0 text-ink/[0.07]"
          style={{ maskImage: "radial-gradient(ellipse at center, #000 10%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at center, #000 10%, transparent 70%)" }}
        />
        <div data-depth="0.3" className="absolute inset-0">
          <SpeedLines className="hero-lines animate-spin-slow absolute top-1/2 left-1/2 h-[180vmax] w-[180vmax] -translate-x-1/2 -translate-y-1/2 text-ink/[0.08]" count={120} inner={0.18} />
        </div>
      </div>

      <div data-depth="0.5" className="pointer-events-none absolute top-[10%] -right-[4%] select-none" aria-hidden="true">
        <span className="hero-616 font-display text-outline-ink block text-[38vw] opacity-[0.07] lg:text-[26vw]">616</span>
      </div>

      {/* The disc */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="hero-disc-wrap h-[min(82vw,64svh)] w-[min(82vw,64svh)] lg:h-[min(46vw,74svh)] lg:w-[min(46vw,74svh)]">
          <div data-depth="0.6" className="h-full w-full">
            <div className="hero-disc relative h-full w-full overflow-hidden rounded-full bg-hero">
              <div className="disc-fx absolute inset-0">
                <div className="halftone absolute inset-0 text-hero-deep" style={{ maskImage: "linear-gradient(200deg, transparent 30%, #000 90%)", WebkitMaskImage: "linear-gradient(200deg, transparent 30%, #000 90%)" }} />
                <SpeedLines className="absolute inset-0 h-full w-full text-white/15" count={70} inner={0.45} seed={9} />
              </div>
              {/* Targeting reticle */}
              <svg viewBox="0 0 100 100" className="disc-emblem animate-spin-slow absolute inset-[6%]" aria-hidden="true">
                <g fill="none" stroke="#fbfaf7" strokeLinecap="round">
                  <circle className="ret-line" cx="50" cy="50" r="48" strokeWidth="0.35" opacity="0.6" />
                  <circle cx="50" cy="50" r="43" strokeWidth="0.25" strokeDasharray="0.8 2.2" opacity="0.7" />
                  <path className="ret-line" d="M50 0.5V8M50 92V99.5M0.5 50H8M92 50H99.5" strokeWidth="0.6" />
                  <path
                    className="ret-line"
                    d="M50 2A48 48 0 0 1 84 16M98 50A48 48 0 0 1 84 84M50 98A48 48 0 0 1 16 84M2 50A48 48 0 0 1 16 16"
                    stroke="#0b0b0c"
                    strokeWidth="1.2"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Comic panels */}
      {PANELS.map((p, i) => (
        <div key={p.hero} className={cn("hero-panel absolute z-10", p.className)}>
          <div data-depth={p.depth}>
            <div className="panel-tilt relative" style={{ transform: `rotate(${p.rot}deg)` }}>
              <button
                type="button"
                onClick={() => onPanel(i)}
                aria-label={p.label}
                data-cursor={p.hero === "thor" ? "Lift?" : p.hero === "captain-america" ? "Throw" : "Pow!"}
                className="panel-clip block w-full border-[3px] border-ink bg-paper p-1.5 shadow-[8px_8px_0_#0b0b0c] transition-shadow hover:shadow-[12px_12px_0_#e8202a]"
              >
                <HeroArt hero={p.hero} decorative className="block aspect-[4/5] w-full" />
              </button>
              <SfxBurst text={p.sfx} seed={i + 3} className="panel-sfx pointer-events-none invisible absolute -top-10 -right-10 w-28 lg:w-36" />
            </div>
          </div>
        </div>
      ))}

      {/* Title block */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="h-out">
          <p className="h-fade mono-label mb-3 flex items-center gap-3 sm:mb-5">
            <span className="h-px w-8 bg-ink" aria-hidden="true" />
            Earth&apos;s Mightiest Heroes
            <span className="h-px w-8 bg-ink" aria-hidden="true" />
          </p>
        </div>
        <h1 id="hero-title" className="font-display text-[clamp(4.2rem,19.5vw,24rem)] leading-[0.8] text-ink lg:text-[min(16vw,30svh)]" aria-label="Avengers">
          <span className="flex justify-center" aria-hidden="true">
            {TITLE.map((c, i) => (
              <span key={i} className="h-char split-line inline-block">
                <span className="h-char-in inline-block">{c}</span>
              </span>
            ))}
          </span>
        </h1>
        <div className="h-out flex flex-col items-center">
          <p className="h-fade mt-5 max-w-[32ch] text-base font-semibold text-ink sm:mt-7 sm:text-lg">
            An interactive archive of six legends, sixty years of comics, and one universe worth saving.
          </p>
          <div className="h-fade mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-9">
            <Magnetic>
              <a
                href="#roster"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#roster");
                }}
                data-cursor="Enter"
                className="group inline-flex items-center gap-3 rounded-full bg-ink py-2 pr-2 pl-6 text-sm font-bold tracking-wide text-white uppercase transition-colors hover:bg-hero"
              >
                Enter the universe
                <span className="grid h-10 w-10 place-items-center rounded-full bg-hero transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-hero">
                  <ArrowUpRight size={18} />
                </span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* HUD */}
      <div className="h-out pointer-events-none absolute bottom-5 left-4 z-20 sm:left-8">
        <div className="h-fade mono-label flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-ink/30">
            <ArrowDown size={14} className="animate-bounce" />
          </span>
          Scroll to assemble
        </div>
      </div>
      <div className="h-out absolute right-4 bottom-4 z-20 sm:right-8 sm:bottom-5">
        <div className="h-fade mono-label flex items-center gap-3 text-right">
          <span className="hidden sm:block">
            File 001 — Earth-616
            <br />
            <span className="text-smoke">40.7516° N, 73.9755° W</span>
          </span>
          <Stone id="space" />
        </div>
      </div>

      <div className="hero-flash pointer-events-none invisible absolute inset-0 z-30 bg-[#d9f1ff]" aria-hidden="true" />
    </section>
  );
}
