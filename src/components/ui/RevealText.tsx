"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "lines" slides masked lines up; "words" staggers words; "chars" for short display type. */
  by?: "lines" | "words" | "chars";
  delay?: number;
  start?: string;
};

/** Masked, scroll-triggered text reveal powered by SplitText (re-splits on resize/font load). */
export function RevealText({ as: Tag = "p", children, className, by = "lines", delay = 0, start = "top 85%" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`(prefers-reduced-motion: no-preference)`, () => {
        if (!ref.current) return;
        const split = SplitText.create(ref.current, {
          type: by === "chars" ? "lines,words,chars" : "lines,words",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            const targets = by === "chars" ? self.chars : by === "words" ? self.words : self.lines;
            return gsap.from(targets, {
              yPercent: 115,
              rotate: by === "lines" ? 0 : 6,
              duration: by === "chars" ? 0.9 : 1.15,
              stagger: by === "chars" ? 0.025 : by === "words" ? 0.04 : 0.1,
              ease: "expo.out",
              delay,
              scrollTrigger: { trigger: ref.current, start, once: true },
            });
          },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
