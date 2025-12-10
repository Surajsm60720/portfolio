"use client";
import SkillNetwork from "./ui/SkillNetwork";

export default function SkillsSection() {
  return (
    <section id="skills" className="mb-8 scroll-mt-16 md:mb-12 lg:mb-16 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">Skills</h2>
      </div>
      <SkillNetwork />
    </section>
  );
};
