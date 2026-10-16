"use client";

import { useRef } from "react";
import { STONES, type StoneId } from "@/data/stones";
import { useExperience } from "@/components/providers/Experience";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

/** A gem glyph. Shared by the hidden stones and the nav HUD. */
export function Gem({ color, glow, className }: { color: string; glow: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 2L20 8L17 21H7L4 8Z" fill={color} stroke="#0b0b0c" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 2L12 21M4 8H20M7 21L12 8L17 21" stroke={glow} strokeWidth="1" opacity="0.8" fill="none" />
      <path d="M9 5L12 3L12 7Z" fill="#fff" opacity="0.7" />
    </svg>
  );
}

/**
 * An Infinity Stone hidden somewhere in the page. Find all six → snap.
 * Rendered as a real button so keyboard users can hunt them too.
 */
export function Stone({ id, className }: { id: StoneId; className?: string }) {
  const { stones, collectStone } = useExperience();
  const ref = useRef<HTMLButtonElement>(null);
  const stone = STONES.find((s) => s.id === id)!;
  const found = stones.includes(id);

  const onCollect = () => {
    const el = ref.current;
    if (!el || found) return;
    const hud = document.getElementById("stone-hud");
    const from = el.getBoundingClientRect();
    const to = hud?.getBoundingClientRect();

    // Fly a clone of the gem up to the HUD counter.
    const ghost = el.cloneNode(true) as HTMLElement;
    Object.assign(ghost.style, {
      position: "fixed",
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
      margin: "0",
      zIndex: "200",
      pointerEvents: "none",
    });
    ghost.removeAttribute("id");
    document.body.appendChild(ghost);
    collectStone(id);

    gsap
      .timeline({ onComplete: () => ghost.remove() })
      .to(ghost, { scale: 2.2, rotate: 180, duration: 0.35, ease: "back.out(3)" })
      .to(ghost, {
        x: to ? to.left + to.width / 2 - (from.left + from.width / 2) : 0,
        y: to ? to.top + to.height / 2 - (from.top + from.height / 2) : -200,
        scale: 0.6,
        rotate: 540,
        duration: 0.8,
        ease: "power3.inOut",
      })
      .to(ghost, { autoAlpha: 0, duration: 0.15 });
  };

  if (found) return null;

  return (
    <button
      ref={ref}
      type="button"
      onClick={onCollect}
      data-cursor="?"
      aria-label={`A hidden ${stone.name}. Collect it.`}
      title="Something glimmers…"
      className={cn(
        "group relative z-20 grid h-8 w-8 place-items-center rounded-full outline-offset-4 transition-transform hover:scale-125",
        className,
      )}
    >
      <span
        className="absolute inset-0 rounded-full opacity-60 blur-md transition-opacity group-hover:opacity-100"
        style={{ background: stone.glow }}
      />
      <Gem color={stone.color} glow={stone.glow} className="animate-stone relative h-5 w-5" />
    </button>
  );
}
