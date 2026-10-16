# Assemble: An Interactive Avengers Archive

A cinematic, fan-made Marvel superhero site built with Next.js (App Router), TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText, DrawSVG) and Lenis.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Experience

| Section | What happens |
| --- | --- |
| **Preloader** | Spider-web threads shoot in from the screen edges and stitch the emblem together. The slash strikes with a particle burst, then a red curtain wipe reveals the site. It waits at most 2.2s for fonts, has a 7s JS hard stop and an 8s CSS failsafe. |
| **Hero** | A masked red disc, a giant headline rising letter by letter and comic panels with mouse-depth parallax. On scroll it is pinned: the letters scatter and the disc swallows the screen into the next section. |
| **The Oath** | Manifesto words light up as you scroll, with counters and an "Excelsior!" burst. |
| **Marquee** | Catchphrase rows whose speed and skew react to scroll velocity. |
| **Roster** | On desktop, a pinned horizontal strip with six hero files. Each file has a clip-path reveal, a 3D tilt card and parallax numerals. On mobile it becomes a vertical stack. |
| **Assemble** | On desktop it is pinned and scrubbed: six medallions fly in and lock into formation while the emblem draws itself, then a red flash and the title stamps in. |
| **Dossier** | An accessible tablist (arrow keys, Home and End). Switching heroes plays a color wipe. Inside are Powers (animated bars), Profile and Universe. |
| **Origins** | Real first-appearance history, with a sticky odometer year that rolls digit by digit. |
| **Finale & footer** | "Whatever it takes" and the stone tracker. |

### Easter eggs
- **Six Infinity Stones** are hidden across the page. Collecting all six triggers the Snap and the page turns to dust.
- In the hero, click Cap's panel to throw the shield. Click Mjolnir five times to prove you're worthy.
- ↑ ↑ ↓ ↓ ← → ← → B A

## Structure

```
src/
  app/                 layout (fonts, boot script), page, globals.css (design tokens)
  components/
    art/               original SVG illustrations: HeroArt, Emblem, Comic (bursts, speed lines)
    sections/          Hero, Manifesto, Marquee, Roster, Assemble, Dossier, Origins, Finale
    ui/                Cursor, Magnetic, TiltCard, RevealText, Stone
    providers/         ExperienceProvider (Lenis, loader state, stones, selected hero)
  data/                heroes.ts (content + comic history), stones.ts
  lib/gsap.ts          plugin registration, custom eases, shared media queries
```

## Notes
- All animations go through `useGSAP` / `gsap.matchMedia()`, so timelines and ScrollTriggers are reverted on unmount and rebuilt per breakpoint.
- With `prefers-reduced-motion`, Lenis, pinning and scrubbing are disabled and the static layout stays fully readable.
- All artwork is original SVG, with no external image requests. This is a fan-made, non-commercial tribute that is not affiliated with Marvel.
