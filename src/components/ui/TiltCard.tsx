"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/**
 * Subtle 3D tilt with a moving glare. Children marked [data-z] float at that depth (px).
 * Inert on touch and reduced-motion devices.
 */
export function TiltCard({ children, className, max = 9 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !contextSafe) return;
      if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

      gsap.set(el, { transformPerspective: 1000, transformStyle: "preserve-3d" });
      el.querySelectorAll<HTMLElement>("[data-z]").forEach((n) => gsap.set(n, { z: Number(n.dataset.z) }));

      const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
      const gx = gsap.quickTo(glare.current, "xPercent", { duration: 0.6, ease: "power3" });
      const gy = gsap.quickTo(glare.current, "yPercent", { duration: 0.6, ease: "power3" });

      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * max * 2);
        rx(-py * max * 2);
        gx(px * 100);
        gy(py * 100);
        gsap.to(glare.current, { opacity: 1, duration: 0.3 });
      });
      const leave = contextSafe(() => {
        rx(0);
        ry(0);
        gsap.to(glare.current, { opacity: 0, duration: 0.5 });
      });

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative will-change-transform", className)}>
      {children}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          ref={glare}
          className="absolute top-1/2 left-1/2 h-[160%] w-[160%] -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-overlay"
          style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.75), transparent 45%)" }}
        />
      </div>
    </div>
  );
}
