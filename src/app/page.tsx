import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Marquee } from "@/components/sections/Marquee";
import { Roster } from "@/components/sections/Roster";
import { Assemble } from "@/components/sections/Assemble";
import { Dossier } from "@/components/sections/Dossier";
import { Origins } from "@/components/sections/Origins";
import { Finale } from "@/components/sections/Finale";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Manifesto />
        <Marquee />
        <Roster />
        <Assemble />
        <Dossier />
        <Origins />
        <Finale />
      </main>
      <Footer />
    </>
  );
}
