"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useExperience } from "@/components/providers/Experience";
import { Wordmark } from "@/components/art/Emblem";
import { Gem } from "@/components/ui/Stone";
import { STONES } from "@/data/stones";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#roster", label: "Roster", num: "01" },
  { href: "#assemble", label: "Assemble", num: "02" },
  { href: "#dossier", label: "Dossier", num: "03" },
  { href: "#origins", label: "Origins", num: "04" },
];

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;
  const { loaded, scrollTo, stones } = useExperience();

  // Intro + hide-on-scroll-down / show-on-scroll-up.
  useGSAP(
    () => {
      if (!loaded) return;
      gsap.fromTo(bar.current, { yPercent: -130 }, { yPercent: 0, duration: 1, delay: 0.6, ease: "expo.out" });
      let hidden = false;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const hide = !openRef.current && self.direction === 1 && self.scroll() > 300;
          if (hide === hidden) return;
          hidden = hide;
          gsap.to(bar.current, { yPercent: hide ? -130 : 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        },
      });
      return () => st.kill();
    },
    { dependencies: [loaded] },
  );

  // Fullscreen menu choreography.
  useGSAP(
    () => {
      const el = overlay.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      if (open) {
        gsap
          .timeline()
          .set(el, { visibility: "visible" })
          .fromTo(el, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.8, ease: "cine" })
          .fromTo(q(".m-link"), { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.8, ease: "expo.out" }, 0.25)
          .fromTo(q(".m-foot"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 0.5);
        q<HTMLAnchorElement>(".m-anchor")[0]?.focus({ preventScroll: true });
      } else {
        gsap.to(el, {
          clipPath: "circle(0% at 100% 0%)",
          duration: 0.6,
          ease: "cine",
          onComplete: () => gsap.set(el, { visibility: "hidden" }),
        });
      }
    },
    { dependencies: [open] },
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <header ref={bar} className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 rounded-full border border-ink/10 bg-paper/80 py-2 pr-2 pl-4 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl"
        >
          <a href="#top" onClick={(e) => go(e, "#top")} aria-label="Assemble — back to top" data-cursor="Home">
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  className="group relative flex items-baseline gap-1.5 overflow-hidden rounded-full px-4 py-2 text-sm font-semibold tracking-tight"
                >
                  <span className="mono-label text-[0.6rem] text-hero">{l.num}</span>
                  <span className="relative block overflow-hidden">
                    <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
                      {l.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 block translate-y-full text-hero transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0"
                    >
                      {l.label}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div
              id="stone-hud"
              className="flex items-center gap-0.5 rounded-full bg-ink px-2.5 py-2"
              role="status"
              aria-label={`${stones.length} of 6 Infinity Stones found`}
              title={stones.length ? `${stones.length}/6 stones — keep looking` : "Six stones are hidden on this page…"}
            >
              {STONES.map((s) => {
                const got = stones.includes(s.id);
                return (
                  <span key={s.id} className={cn("transition-all duration-500", got ? "scale-100 opacity-100" : "scale-75 opacity-25 grayscale")}>
                    <Gem color={s.color} glow={s.glow} className="h-3.5 w-3.5" />
                  </span>
                );
              })}
            </div>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center rounded-full bg-hero text-white transition-transform hover:scale-105 active:scale-95 lg:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <a
              href="#dossier"
              onClick={(e) => go(e, "#dossier")}
              className="hidden items-center gap-1 rounded-full bg-hero px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-ink lg:inline-flex"
              data-cursor="Explore"
            >
              Choose a hero <ArrowUpRight size={16} />
            </a>
          </div>
        </nav>
      </header>

      <div
        ref={overlay}
        id="mobile-menu"
        className="fixed inset-0 z-40 flex flex-col justify-between bg-hero px-6 pt-28 pb-8 text-white lg:hidden"
        style={{ visibility: "hidden", clipPath: "circle(0% at 100% 0%)" }}
        aria-hidden={!open}
      >
        <div className="halftone pointer-events-none absolute inset-0 text-black/10" aria-hidden="true" />
        <ul className="relative space-y-1">
          {LINKS.map((l) => (
            <li key={l.href} className="overflow-hidden">
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                tabIndex={open ? 0 : -1}
                className="m-anchor m-link flex items-baseline gap-3"
              >
                <span className="mono-label text-white/70">{l.num}</span>
                <span className="font-display text-[clamp(3.5rem,17vw,7rem)]">{l.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="m-foot mono-label relative text-white/80">
          Earth-616 // Six stones are hidden on this page.
        </p>
      </div>
    </>
  );
}
