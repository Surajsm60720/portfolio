"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, Instagram, FileText } from "lucide-react";
import Magnetic from "./ui/Magnetic";

// Custom X (formerly Twitter) icon
const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const NAV_ITEMS = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
];

export default function HeroSection() {
  const [activeSection, setActiveSection] = useState("about");
  const [isNightOwl, setIsNightOwl] = useState(false);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      setIsNightOwl(hour >= 22 || hour < 6);
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + window.innerHeight * 0.3; // 30% from top

      let currentSection = "about";

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="flex flex-col gap-8 items-start justify-between w-full h-full max-h-[80vh]">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Suraj Menon
          </h1>
          <h2 className="mt-3 text-lg font-medium tracking-tight text-white/80 sm:text-xl">
            Full-Stack Developer | Tech Enthusiast
          </h2>

          {/* Status Badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
              🎧 Vibing and Coding
            </span>
            {isNightOwl && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
                🌙 Night owl mode
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60">
              💼 Final year @ DSCE
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-xs font-medium text-teal-300">
              🎓 Graduating 2026
            </span>
          </div>

          <nav className="nav hidden lg:block mt-16">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="group flex items-center py-3 transition-all duration-300"
                    >
                      {/* Animated indicator line */}
                      <span
                        className={`
                          relative h-px mr-4 transition-all duration-300 ease-out
                          ${isActive ? 'w-16 bg-gradient-to-r from-teal-400 to-teal-300' : 'w-8 bg-white/30 group-hover:w-12 group-hover:bg-white/60'}
                        `}
                      >
                        {isActive && (
                          <span className="absolute inset-0 bg-teal-400/50 blur-sm" />
                        )}
                      </span>
                      {/* Nav text */}
                      <span
                        className={`
                          text-xs font-bold uppercase tracking-widest transition-all duration-300
                          ${isActive ? 'text-teal-300' : 'text-white/40 group-hover:text-white/80'}
                        `}
                      >
                        {item.name}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Social Links Footer in Sidebar */}
        <div className="flex items-center gap-5">
          <Magnetic>
            <a href="https://github.com/Surajsm60720" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors block" aria-label="GitHub">
              <Github size={24} />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="https://linkedin.com/in/suraj-menon" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors block" aria-label="LinkedIn">
              <Linkedin size={24} />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors block" aria-label="Instagram">
              <Instagram size={24} />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors block" aria-label="X">
              <XIcon size={24} />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="mailto:surajmenon@example.com" className="text-white/40 hover:text-white transition-colors block" aria-label="Email">
              <Mail size={24} />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors" aria-label="Resume">
              <FileText size={24} />
              <span className="text-sm font-medium uppercase tracking-widest hidden xl:block">Resume</span>
            </a>
          </Magnetic>
        </div>
      </div>
    </>
  );
}
