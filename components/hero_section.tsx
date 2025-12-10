"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Mail, Twitter, Instagram, FileText } from "lucide-react";
import Magnetic from "./ui/Magnetic";

const NAV_ITEMS = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
];

export default function HeroSection() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
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
          <p className="mt-6 max-w-xs leading-normal text-white/60">
            I engineer simple, high-performance web solutions that solve real-world problems.
          </p>

          <nav className="nav hidden lg:block mt-16">
            <ul className="flex flex-col w-max">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`group flex items - center py - 3 active`}
                  >
                    <span className={`nav - indicator mr - 4 h - px w - 8 bg - white / 40 transition - all group - hover: w - 16 group - hover: bg - white ${activeSection === item.href.substring(1) ? "w-16 bg-white" : ""} `}></span>
                    <span className={`nav - text text - xs font - bold uppercase tracking - widest text - white / 40 group - hover: text - white transition - colors ${activeSection === item.href.substring(1) ? "text-white" : ""} `}>
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
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
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors block" aria-label="Twitter">
              <Twitter size={24} />
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
