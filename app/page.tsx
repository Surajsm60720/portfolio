import TopRail from "@/components/chrome/TopRail";
import Hero from "@/components/sections/Hero";
import Now from "@/components/sections/Now";
import Work from "@/components/sections/Work";
import Escaped from "@/components/sections/Escaped";
import ShipLog from "@/components/sections/ShipLog";
import Proof from "@/components/sections/Proof";
import Rhythm from "@/components/sections/Rhythm";
import StackLedger from "@/components/sections/StackLedger";
import Footer from "@/components/sections/Footer";
import DPad from "@/components/DPad";

export default function Home() {
  return (
    <>
      <TopRail />
      <div className="page">
        <main id="top">
          <Hero />
          <Now />
          <Work />
          <Escaped />
          <ShipLog />
          <Proof />
          <Rhythm />
          <StackLedger />
        </main>
        <Footer />
      </div>

      {/* Not hero furniture: the handheld only appears in console mode, but
          its listeners — the Konami code, the controller poll — run always. */}
      <DPad />
    </>
  );
}
