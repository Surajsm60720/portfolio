import TopRail from "@/components/chrome/TopRail";
import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import Escaped from "@/components/sections/Escaped";
import ShipLog from "@/components/sections/ShipLog";
import Proof from "@/components/sections/Proof";
import Rhythm from "@/components/sections/Rhythm";
import StackLedger from "@/components/sections/StackLedger";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <TopRail />
      <main id="top">
        <Hero />
        <Work />
        <Escaped />
        <ShipLog />
        <Proof />
        <Rhythm />
        <StackLedger />
      </main>
      <Footer />
    </>
  );
}
