"use client";
import SplitText from "./ui/SplitText";
import ExperiencePill from "./ui/ExperiencePill";

export default function ExperienceSection() {
  const experiences = [
    {
      company: "Bharatcrest Pvt. Ltd.",
      position: "Frontend Developer",
      duration: "June 2025 - August 2025",
      location: "Remote",
      type: "Part-Time",
      description: "Helped build the frontend for 2 major projects that are successfully deployed and are in production. Designed and built the website HRMatcher using Django framework, which helps companies find the right candidates based on their requirements using AI. Collaborated with a team of 3 developers to build the ProfitPal application using React and Python, which helps restaurant owners and staff manage their inventory and sales.",
      technologies: ["React", "Python", "TypeScript", "SQLite", "REST APIs"]
    }
  ];

  return (
    <section id="experience" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white">Experience</h2>
      </div>
      <div className="relative border-l border-white/10 ml-3 md:ml-4 space-y-12 pb-4">
        {experiences.map((experience, index) => (
          <div key={index} className="relative pl-8 md:pl-12 group">
            {/* Timeline Dot */}
            <div className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border border-white/20 bg-[#0a0a0a] group-hover:border-teal-300 group-hover:bg-teal-300/20 transition-colors duration-300" />

            {/* Content using existing Pill component structure but simplified */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h3 className="font-medium text-white text-lg group-hover:text-teal-300 transition-colors duration-300">
                  {experience.position}
                </h3>
                <span className="text-xs font-medium uppercase tracking-wide text-white/40">
                  {experience.duration}
                </span>
              </div>

              <div className="text-sm font-medium text-white/60 mb-2">
                {experience.company} • {experience.type}
              </div>

              <p className="text-sm leading-relaxed text-white/50 mb-4">
                {experience.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, i) => (
                  <span key={i} className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-teal-200/70 border border-white/5 group-hover:border-teal-500/20 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}