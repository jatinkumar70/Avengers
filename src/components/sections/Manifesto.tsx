"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { SfxBurst } from "@/components/art/Comic";
import { Emblem } from "@/components/art/Emblem";
import { Stone } from "@/components/ui/Stone";
import { cn } from "@/lib/cn";

/** Manifesto copy; `*word*` renders in white. */
const COPY =
  "When the world needed protecting, they didn't wait for permission. A genius in iron. A god of thunder. A soldier out of time. A kid from Queens. A sorcerer. A king. *Six* *legends.* *One* *oath.* Whatever it takes.";

const STATS = [
  { value: 1963, label: "The Avengers #1 hits newsstands", suffix: "" },
  { value: 60, label: "Years of stories, still assembling", suffix: "+" },
  { value: 616, label: "Our home reality in the multiverse", suffix: "" },
];

export function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const [nuff, setNuff] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q(".mf-word"),
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: q(".mf-copy")[0], start: "top 75%", end: "bottom 45%", scrub: true },
          },
        );

        q<HTMLElement>(".mf-count").forEach((el) => {
          const target = Number(el.dataset.value);
          const obj = { v: target > 1000 ? 1900 : 0 };
          gsap.to(obj, {
            v: target,
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => (el.textContent = String(Math.round(obj.v))),
          });
        });

        gsap.from(q(".mf-stat"), {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".mf-stats")[0], start: "top 88%", once: true },
        });

        gsap.to(q(".mf-emblem"), {
          rotate: 120,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      mm.add(MQ.desktop, () => {
        gsap.from(q(".mf-sfx"), {
          scale: 0,
          rotate: -30,
          duration: 0.8,
          ease: "back.out(2.5)",
          scrollTrigger: { trigger: q(".mf-sfx")[0], start: "top 85%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const words = COPY.split(" ");

  return (
    <section ref={root} aria-labelledby="oath-title" className="relative overflow-hidden bg-hero text-ink">
      <div
        className="halftone pointer-events-none absolute inset-0 text-hero-deep"
        style={{ maskImage: "linear-gradient(to top, #000 0%, transparent 55%)", WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 55%)" }}
        aria-hidden="true"
      />
      <Emblem className="mf-emblem pointer-events-none absolute -right-[18vw] -bottom-[18vw] h-[60vw] w-[60vw] text-hero-deep opacity-60 lg:h-[42vw] lg:w-[42vw]" slash="#b3131b" />

      <div className="relative mx-auto max-w-[1600px] px-5 py-24 sm:px-10 lg:py-40">
        <div className="mb-10 flex items-center justify-between lg:mb-16">
          <h2 id="oath-title" className="mono-label flex items-center gap-3 text-white">
            <span className="h-px w-10 bg-white" aria-hidden="true" />
            00 — The Oath
          </h2>
          <Stone id="mind" />
        </div>

        <p className="mf-copy font-display max-w-[17ch] text-[clamp(2.6rem,7.4vw,8.5rem)] leading-[0.92]">
          {words.map((w, i) => {
            const em = w.startsWith("*");
            return (
              <span key={i} className={cn("mf-word inline-block", em && "text-white")}>
                {em ? w.replaceAll("*", "") : w}
                {i < words.length - 1 && " "}
              </span>
            );
          })}
        </p>

        <div className="relative mt-4 hidden justify-end lg:flex">
          <button
            type="button"
            className="mf-sfx relative -mt-40 mr-[6vw] w-56 rotate-6 transition-transform hover:scale-105"
            onClick={() => setNuff(true)}
            onMouseEnter={() => setNuff(true)}
            onMouseLeave={() => setNuff(false)}
            aria-label="Excelsior! (a tip of the hat to Stan Lee)"
            data-cursor="Stan?"
          >
            <SfxBurst text="EXCELSIOR!" seed={21} />
            <span
              className={cn(
                "absolute -top-14 -left-24 rounded-[50%] border-[3px] border-ink bg-white px-5 py-3 font-comic text-xl whitespace-nowrap text-ink transition-all duration-300",
                nuff ? "scale-100 opacity-100" : "scale-50 opacity-0",
              )}
              aria-hidden={!nuff}
            >
              &apos;Nuff said! — Stan
            </span>
          </button>
        </div>

        <dl className="mf-stats mt-20 grid gap-8 border-t-2 border-ink pt-8 sm:grid-cols-3 lg:mt-28">
          {STATS.map((s) => (
            <div key={s.label} className="mf-stat">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-7xl text-white lg:text-8xl">
                <span className="mf-count tabular-nums" data-value={s.value}>
                  {s.value}
                </span>
                <span className="text-ink">{s.suffix}</span>
              </dd>
              <dd className="mono-label mt-3 text-ink" aria-hidden="true">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
