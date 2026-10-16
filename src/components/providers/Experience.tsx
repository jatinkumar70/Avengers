"use client";

import Lenis from "lenis";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import type { StoneId } from "@/data/stones";
import { STONES } from "@/data/stones";
import type { HeroId } from "@/data/heroes";

type ExperienceState = {
  /** True once the preloader has finished its exit. */
  loaded: boolean;
  markLoaded: () => void;
  scrollTo: (target: string | number | HTMLElement) => void;
  stones: StoneId[];
  collectStone: (id: StoneId) => void;
  snapCount: number;
  resetStones: () => void;
  /** Hero currently open in the Dossier explorer. */
  dossierHero: HeroId;
  setDossierHero: (id: HeroId) => void;
  openDossier: (id: HeroId) => void;
};

const ExperienceContext = createContext<ExperienceState | null>(null);

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return ctx;
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [stones, setStones] = useState<StoneId[]>([]);
  const [snapCount, setSnapCount] = useState(0);
  const [dossierHero, setDossierHero] = useState<HeroId>("iron-man");
  const lenisRef = useRef<Lenis | null>(null);

  // Smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis share one clock.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (document.documentElement.classList.contains("is-loading")) lenis.stop();

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const markLoaded = useCallback(() => {
    document.documentElement.classList.remove("is-loading");
    lenisRef.current?.start();
    setLoaded(true);
    // Layout may have shifted while fonts/art settled under the loader.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
      return;
    }
    if (typeof target === "number") {
      window.scrollTo({ top: target });
      return;
    }
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView();
  }, []);

  const collectStone = useCallback((id: StoneId) => {
    setStones((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  // All six stones gathered → the snap.
  useEffect(() => {
    if (stones.length === STONES.length) setSnapCount((n) => n + 1);
  }, [stones]);

  const resetStones = useCallback(() => setStones([]), []);

  const openDossier = useCallback(
    (id: HeroId) => {
      setDossierHero(id);
      scrollTo("#dossier");
    },
    [scrollTo],
  );

  const value = useMemo<ExperienceState>(
    () => ({
      loaded,
      markLoaded,
      scrollTo,
      stones,
      collectStone,
      snapCount,
      resetStones,
      dossierHero,
      setDossierHero,
      openDossier,
    }),
    [loaded, markLoaded, scrollTo, stones, collectStone, snapCount, resetStones, dossierHero, openDossier],
  );

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}
