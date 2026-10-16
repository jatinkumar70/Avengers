import type { Metadata, Viewport } from "next";
import { Anton, Bangers, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ExperienceProvider } from "@/components/providers/Experience";
import { Preloader } from "@/components/Preloader";
import { Cursor } from "@/components/ui/Cursor";
import { EasterEggs } from "@/components/EasterEggs";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap" });
const inter = Inter_Tight({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-jb", display: "swap" });
const bangers = Bangers({ subsets: ["latin"], weight: "400", variable: "--font-bangers", display: "swap" });

export const metadata: Metadata = {
  title: "Assemble — An Interactive Avengers Archive",
  description:
    "A cinematic, fan-made interactive archive of Earth's mightiest heroes: Iron Man, Spider-Man, Thor, Captain America, Doctor Strange and Black Panther.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='86' fill='%23fbfaf7' stroke='%230b0b0c' stroke-width='12'/%3E%3Cpath d='M100 30L152 162L128 162L117 134L83 134L72 162L48 162ZM100 80L111 112L89 112Z' fill='%230b0b0c' fill-rule='evenodd'/%3E%3Cpath d='M14 148L182 98L188 113L20 163Z' fill='%23e8202a'/%3E%3C/svg%3E",
  },
  openGraph: {
    title: "Assemble — An Interactive Avengers Archive",
    description: "Six legends. Sixty years. One universe. A cinematic fan tribute.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before paint: lock scroll for the preloader, always start at the top,
 * and release the lock no matter what after 9s.
 */
const bootScript = `(function(){try{var d=document.documentElement;d.classList.add('is-loading');if('scrollRestoration' in history)history.scrollRestoration='manual';window.scrollTo(0,0);setTimeout(function(){d.classList.remove('is-loading')},9000);}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${inter.variable} ${mono.variable} ${bangers.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <ExperienceProvider>
          <a
            href="#main"
            className="sr-only z-[200] rounded bg-hero px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
          >
            Skip to content
          </a>
          <Preloader />
          {children}
          <EasterEggs />
          <Cursor />
        </ExperienceProvider>
      </body>
    </html>
  );
}
