"use client";
import { ShaderAnimation } from "@/components/ui/shader-animation";
import SplitText from "@/components/ui/SplitText";
import BlurText from "@/components/ui/BlurText";

export default function HeroSection() {
  return (
    <>
      <ShaderAnimation/>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <span className="text-center text-4xl md:text-7xl leading-none font-semibold tracking-tighter whitespace-pre-wrap text-white">
          <SplitText
            text="Hi! I'm Suraj Menon"
            className="text-4xl md:text-7xl font-semibold text-center py-4"
            delay={50}
            duration={0.5}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <BlurText
            text="Full-Stack Developer | Tech Enthusiast"
            delay={200}
            animateBy="words"
            direction="top"
            className="text-2xl md:text-4xl mb-8"
            animationFrom={{ opacity: 0, y: -10 }}
            animationTo={[{ opacity: 1, y: 0 }]}
            textalign="center"
          />
        </span>
      </div>
    </>
  );
}
