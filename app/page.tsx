import TopRail from "@/components/chrome/TopRail";
import Hero from "@/components/sections/Hero";
import Now from "@/components/sections/Now";
import Work from "@/components/sections/Work";
import Escaped from "@/components/sections/Escaped";
import ShipLog from "@/components/sections/ShipLog";
import Proof from "@/components/sections/Proof";
import Rhythm from "@/components/sections/Rhythm";
import OffTheClock from "@/components/sections/OffTheClock";
import StackLedger from "@/components/sections/StackLedger";
import Colophon from "@/components/sections/Colophon";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <TopRail />
      <main id="top">
        <Hero />
        <Now />
        <Work />
        <Escaped />
        <ShipLog />
        <Proof />
        <Rhythm />
        <OffTheClock />
        <StackLedger />
        <Colophon />
      </main>
      <Footer />
    </>
  );
}
