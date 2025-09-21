"use client";
import SplitText from "./ui/SplitText";
import SkillsOrbitDisplay from "./ui/SkillsOrbit";

export default function SkillsSection() {
  return (
    <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <SplitText
            text="Skills & Technologies"
            className="text-4xl md:text-7xl font-bold text-center pb-8"
            delay={50}
            duration={0.5}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="100px"
            textAlign="center"
        />
        <div className="w-full py-8">
          <SkillsOrbitDisplay />
        </div>
    </div>
  );
};

