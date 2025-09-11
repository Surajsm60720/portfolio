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
    <div className="container mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <SplitText
        text="Work Experience"
        className="text-7xl font-bold text-center pb-12"
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
      <div className="w-full space-y-4">
        {experiences.map((experience, index) => (
          <ExperiencePill
            key={index}
            company={experience.company}
            position={experience.position}
            duration={experience.duration}
            location={experience.location}
            type={experience.type}
            description={experience.description}
            technologies={experience.technologies}
          />
        ))}
      </div>
    </div>
  );
}