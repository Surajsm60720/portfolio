"use client";
import HeroSection from "@/components/hero_section";
import AboutSection from "@/components/about_section"
import ProjectSection from "@/components/projects_section";
import ExperienceSection from "@/components/experience_section";
import SkillsSection from "@/components/skills_section";
import ContactSection from "@/components/contact_section";

export default function Home() {
  return (
    <main className="w-full">
      <section className="min-h-screen flex items-center justify-center">
        <HeroSection />
      </section>
      <section
        className="min-h-screen flex items-center justify-center text-white relative"
        style={{ overflow: "hidden" }}
      >
        <div
          className="absolute inset-0 backdrop-blur-lg pointer-events-none"
          aria-hidden="true"
        />
        <AboutSection />
      </section>
      <section
        className="min-h-screen flex items-center justify-center text-white relative"
        style={{ overflow: "hidden" }}
      >
        <div
          className="absolute inset-0 backdrop-blur-lg pointer-events-none"
          aria-hidden="true"
        />
        <SkillsSection />
      </section>
      <section
        className="min-h-screen flex items-center justify-center text-white relative"
        style={{ overflow: "hidden" }}
      >
        <div
          className="absolute inset-0 backdrop-blur-lg pointer-events-none"
          aria-hidden="true"
        />
        <ProjectSection />
      </section>
      <section
        className="min-h-screen flex items-center justify-center text-white relative"
        style={{ overflow: "hidden" }}
      >
        <div
          className="absolute inset-0 backdrop-blur-lg pointer-events-none"
          aria-hidden="true"
        />
        <ExperienceSection />
      </section>
      <section
        className="min-h-screen flex items-center justify-center text-white relative"
        style={{ overflow: "hidden" }}
      >
        <div
          className="absolute inset-0 backdrop-blur-lg pointer-events-none"
          aria-hidden="true"
        />
        <ContactSection />
      </section>
    </main>
  );
}
