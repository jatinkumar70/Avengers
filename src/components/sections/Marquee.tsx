"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Emblem } from "@/components/art/Emblem";

const ROW_A = ["Avengers Assemble", "Excelsior", "Wakanda Forever", "I Am Iron Man", "Whatever It Takes"];
const ROW_B = ["'Nuff Said", "Hulk Smash", "I Can Do This All Day", "Dormammu, I've Come to Bargain", "Thwip"];

function Row({ items, outline }: { items: string[]; outline?: boolean }) {
  const content = (
    <div className="flex shrink-0 items-center">
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className={outline ? "font-display text-outline-paper px-6 text-[clamp(3rem,8vw,7.5rem)]" : "font-display px-6 text-[clamp(3rem,8vw,7.5rem)]"}>
            {t}
          </span>
          <Emblem className="h-10 w-10 shrink-0 text-paper lg:h-16 lg:w-16" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="mq-row flex w-max will-change-transform">
      {content}
      <div aria-hidden="true" className="flex">
        {content}
      </div>
    </div>
  );
}

/** Two counter-running rows whose speed and skew react to scroll velocity. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rows = gsap.utils.toArray<HTMLElement>(".mq-row", root.current);
      const loops = rows.map((row, i) =>
        gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 38, ease: "none", repeat: -1 }),
      );
      const skew = gsap.quickTo(rows, "skewX", { duration: 0.4, ease: "power3" });

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => loops.forEach((l) => (self.isActive ? l.play() : l.pause())),
        onUpdate: (self) => {
          const v = self.getVelocity();
          const boost = 1 + Math.min(Math.abs(v) / 400, 5);
          loops.forEach((l) => gsap.to(l, { timeScale: (v < 0 ? -1 : 1) * boost, duration: 0.2, overwrite: true }));
          skew(gsap.utils.clamp(-12, 12, v / -220));
        },
        onLeave: () => skew(0),
      });
      // Ease speed back to normal when scrolling stops.
      const idle = () => {
        loops.forEach((l) => gsap.to(l, { timeScale: Math.sign(l.timeScale()) || 1, duration: 1.2, overwrite: true }));
        skew(0);
      };
      ScrollTrigger.addEventListener("scrollEnd", idle);
      return () => {
        st.kill();
        ScrollTrigger.removeEventListener("scrollEnd", idle);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative overflow-hidden bg-ink py-8 text-paper lg:py-12" aria-label="Iconic catchphrases" role="marquee">
      <div className="-rotate-2 space-y-2">
        <Row items={ROW_A} />
        <Row items={ROW_B} outline />
      </div>
    </div>
  );
}
