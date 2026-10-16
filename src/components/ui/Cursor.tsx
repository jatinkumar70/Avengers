"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A two-part cursor: a precise red dot and a lagging ring that inverts over any background.
 * Elements with [data-cursor="LABEL"] swell the ring into a labelled red disc.
 * Only mounts on fine pointers with motion allowed.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current || !bubble.current) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo([ring.current, bubble.current], "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo([ring.current, bubble.current], "y", { duration: 0.45, ease: "power3" });

    gsap.set([dot.current, ring.current, bubble.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(bubble.current, { scale: 0 });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.set(bubble.current, { x: e.clientX, y: e.clientY, autoAlpha: 1 });
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const onOver = (e: Event) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button, [role='tab']");
      const text = t?.dataset.cursor ?? "";
      setLabel(text);
      if (t && text) {
        gsap.to(bubble.current, { scale: 1, duration: 0.45, ease: "back.out(2)" });
        gsap.to(ring.current, { scale: 0, duration: 0.3 });
        gsap.to(dot.current, { scale: 0, duration: 0.2 });
      } else if (t) {
        gsap.to(bubble.current, { scale: 0, duration: 0.3 });
        gsap.to(ring.current, { scale: 1.8, duration: 0.4, ease: "power3.out" });
        gsap.to(dot.current, { scale: 0.5, duration: 0.2 });
      } else {
        gsap.to(bubble.current, { scale: 0, duration: 0.3 });
        gsap.to(ring.current, { scale: 1, duration: 0.4 });
        gsap.to(dot.current, { scale: 1, duration: 0.2 });
      }
    };

    const onDown = () => gsap.to(ring.current, { scale: "*=0.7", duration: 0.15 });
    const onUp = () => gsap.to(ring.current, { scale: "/=0.7", duration: 0.3, ease: "back.out(3)" });
    const onLeave = () => {
      shown = false;
      gsap.to([dot.current, ring.current, bubble.current], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[150]">
      <div ref={ring} className="fixed top-0 left-0 h-10 w-10 rounded-full border-[1.5px] border-white mix-blend-difference" />
      <div
        ref={bubble}
        className="mono-label fixed top-0 left-0 grid h-20 w-20 place-items-center rounded-full bg-hero text-center text-[0.6rem] font-bold text-white"
      >
        {label}
      </div>
      <div ref={dot} className="fixed top-0 left-0 h-2 w-2 rounded-full bg-hero" />
    </div>
  );
}
