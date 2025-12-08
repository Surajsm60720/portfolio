"use client";
import HeroSection from "@/components/hero_section";
import AboutSection from "@/components/about_section"
import ProjectSection from "@/components/projects_section";
import ExperienceSection from "@/components/experience_section";
import SkillsSection from "@/components/skills_section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
      <div className="lg:flex lg:justify-between lg:gap-4">
        {/* Left Fixed Header */}
        <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
          <HeroSection />
        </header>

        {/* Right Scrollable Content */}
        <main id="content" className="pt-24 lg:w-1/2 lg:py-24 flex flex-col gap-24">
          <AboutSection />
          <ExperienceSection />
          <ProjectSection />
          <SkillsSection />
          <Footer />
        </main>
      </div>
    </div>
  );
}
