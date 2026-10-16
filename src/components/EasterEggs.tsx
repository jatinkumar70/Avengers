"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useExperience } from "@/components/providers/Experience";
import { SfxBurst } from "@/components/art/Comic";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const DUST = ["#0b0b0c", "#3a3a3f", "#6b6b70", "#e8202a", "#8a6a4a"];

/** Six stones → the snap. The page turns to dust, then reassembles. */
function Snap() {
  const { snapCount, resetStones } = useExperience();
  const overlay = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [line, setLine] = useState("");

  useEffect(() => {
    if (!snapCount || !overlay.current || !canvas.current) return;
    const main = document.getElementById("main");
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx?.scale(dpr, dpr);

    const reduce = prefersReducedMotion();
    const count = reduce ? 0 : w < 768 ? 700 : 1600;
    const parts = Array.from({ length: count }, () => {
      const x = Math.random() * w;
      return {
        x,
        y: Math.random() * h,
        vx: 0.6 + Math.random() * 2.2,
        vy: -(0.3 + Math.random() * 1.4),
        s: 1 + Math.random() * 2.6,
        c: DUST[(Math.random() * DUST.length) | 0],
        // Disintegrate left → right.
        delay: (x / w) * 1.1 + Math.random() * 0.4,
        life: 1.6 + Math.random() * 1.2,
      };
    });

    let t0 = 0;
    const draw = (time: number) => {
      if (!ctx) return;
      if (!t0) t0 = time;
      const t = time - t0;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        const local = t - p.delay;
        if (local < 0) continue;
        const k = local / p.life;
        if (k > 1) continue;
        const px = p.x + p.vx * local * 60 + Math.sin(local * 3 + p.y) * 6;
        const py = p.y + p.vy * local * 60;
        ctx.globalAlpha = 1 - k;
        ctx.fillStyle = p.c;
        ctx.fillRect(px, py, p.s, p.s);
      }
    };
    const tick = () => draw(gsap.ticker.time);

    setLine("snap");
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.ticker.remove(tick);
        setLine("");
        resetStones();
      },
    });
    tl.set(overlay.current, { autoAlpha: 1 })
      .call(() => gsap.ticker.add(tick))
      .fromTo(".snap-word", { scale: 2.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "expo.out" }, 0)
      .to(main, { opacity: 0.04, duration: 1.8, ease: "power2.in" }, 0.2)
      .fromTo(".snap-sub", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, 0.8)
      .call(() => setLine("restore"), [], 3.2)
      .to(main, { opacity: 1, duration: 1.4, ease: "power2.out" }, 3.4)
      .to(overlay.current, { autoAlpha: 0, duration: 0.8 }, 4.4)
      .set(main, { clearProps: "opacity" });

    return () => {
      tl.kill();
      gsap.ticker.remove(tick);
      if (main) gsap.set(main, { clearProps: "opacity" });
    };
  }, [snapCount, resetStones]);

  return (
    <div ref={overlay} className="pointer-events-none invisible fixed inset-0 z-[120] grid place-items-center" aria-live="assertive">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="relative px-6 text-center">
        <p className="snap-word font-display text-[clamp(5rem,22vw,20rem)] leading-[0.8] text-ink">
          {line === "restore" ? (
            <>
              Re<span className="text-hero">assembled.</span>
            </>
          ) : (
            <>
              Snap<span className="text-hero">.</span>
            </>
          )}
        </p>
        <p className="snap-sub mono-label mt-6 text-ink/80">
          {line === "restore" ? "Stones returned to their timelines. Find them again?" : "Perfectly balanced, as all things should be."}
        </p>
      </div>
    </div>
  );
}

/** ↑↑↓↓←→←→BA → KA-POW. */
function Konami() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === "ArrowUp" ? (pos === 2 ? 2 : 1) : 0;
      if (pos < KONAMI.length) return;
      pos = 0;
      gsap
        .timeline()
        .set(ref.current, { autoAlpha: 1 })
        .fromTo(ref.current!.querySelector(".kp-burst"), { scale: 0, rotate: -40 }, { scale: 1, rotate: -6, duration: 0.7, ease: "elastic.out(1.1, 0.4)" })
        .fromTo(ref.current!.querySelector(".kp-dots"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0)
        .fromTo(ref.current!.querySelector(".kp-shake"), { x: -24 }, { x: 0, duration: 0.6, ease: "elastic.out(2, 0.15)" }, 0.1)
        .to(ref.current, { autoAlpha: 0, duration: 0.4, delay: 0.9 });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={ref} className="pointer-events-none invisible fixed inset-0 z-[120] grid place-items-center" aria-hidden="true">
      <div className="kp-dots halftone absolute inset-0 text-[#f5c518]/40" />
      <div className="kp-shake">
        <SfxBurst text="KA-POW!" seed={99} className="kp-burst w-[min(80vw,640px)]" fill="#e8202a" textColor="#fbfaf7" />
      </div>
    </div>
  );
}

export function EasterEggs() {
  return (
    <>
      <Snap />
      <Konami />
    </>
  );
}
