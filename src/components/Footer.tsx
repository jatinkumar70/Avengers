"use client";

import { ArrowUp } from "lucide-react";
import { useExperience } from "@/components/providers/Experience";
import { Wordmark } from "@/components/art/Emblem";

const NAV = [
  ["#roster", "The Roster"],
  ["#assemble", "The Team"],
  ["#dossier", "Dossier"],
  ["#origins", "Origins"],
] as const;

export function Footer() {
  const { scrollTo } = useExperience();
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-5 pt-20 pb-8 sm:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="[&_svg]:text-paper" />
            <p className="mt-6 max-w-[40ch] text-white/70">
              An interactive tribute to the heroes who taught us that power means responsibility, that teams beat
              egos, and that nobody is too small to stand up.
            </p>
          </div>
          <nav aria-label="Footer">
            <p className="mono-label text-white/50">Navigate</p>
            <ul className="mt-4 space-y-2">
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(href);
                    }}
                    className="font-display text-3xl transition-colors hover:text-hero"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="mono-label text-white/50">Classified</p>
            <ul className="mt-4 space-y-3 text-white/70">
              <li>Six Infinity Stones are hidden in this page. Collect them all.</li>
              <li>Some panels in the opening scene react when clicked.</li>
              <li className="mono-label text-white/40" title="An old code for extra lives">
                ↑ ↑ ↓ ↓ ← → ← → B A
              </li>
            </ul>
          </div>
        </div>

        <div className="font-display text-outline-paper pointer-events-none mt-16 text-center text-[21vw] leading-[0.8] select-none" aria-hidden="true">
          Assemble
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[80ch] text-xs leading-relaxed text-white/50">
            Fan-made, non-commercial tribute. Marvel, the Avengers and all related characters and names are trademarks of
            Marvel Entertainment, LLC. This site is not affiliated with or endorsed by Marvel. All illustrations are
            original artwork.
          </p>
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="mono-label inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/30 px-4 py-2.5 transition-colors hover:bg-white hover:text-ink md:self-auto"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
