"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "TravelEase",
    description: "Trip planner with in-built expense tracking for your trips and advanced map filterings to search places on the route. Check for tourist attractions in a particular radius around any city/town in the world.",
    technologies: ["React.js", "Google Maps API","Supabase" ,"Framer Motion" ,"Tailwind CSS"],
    features: ["Expense planner(who paid, how much, cost split)", "Tourist attractions search", "Find restaurants, hotels, etc. along any planned route", "View detailed information of the places", "Categorize expenses (food, accommodation, transport, etc.)"],
    githubUrl: "https://github.com/Surajsm60720/TravelEase",
    liveUrl: "https://travel-ease-mocha.vercel.app/",
    category: "Full Stack",
  },
  {
    id: 2,
    title: "Linux Starter Pack",
    description: "A simple CLI tool that allows users to install packages based on their Linux distribution. Has a built-in TUI for easy navigation and selection of packages to install.",
    technologies: ["Python", "Textual TUI library", "Next.js", "TypeScript", "Tailwind CSS"],
    features: ["Automatically uses the correct package manager for your distro", "Common development tools, browsers, and applications ready to install", "Easy browsing through categorized software", "Review installation commands before execution", "Use the bash script created for quick setups in the future"],
    githubUrl: "https://github.com/Surajsm60720/linux-starter-pack",
    liveUrl: "https://linuxstarterpack.vercel.app/",
    category: "Python, Shell, Website",
  },
  {
    id: 3,
    title: "NammaLakes",
    description: "An IoT-powered distributed system designed to monitor the health and status of urban lakes. A step toward smarter, data-driven lake conservation and management",
    technologies: ["React", "FastAPI", "RabbitMQ", "PostgreSQL", "MQTT", "Poetry", "Loguru"],
    features: ["Real-time Monitoring of water quality parameters", "ML-powered anomaly detection (Isolation Forest algorithm)", "User-friendly visualization of complex environmental data", "Instant notifications when parameters exceed safe thresholds", "Built to monitor multiple water bodies simultaneously"],
    githubUrl: "https://github.com/NammaLakes",
    liveUrl: "https://nammalakes.github.io/",
    category: "Full Stack, IoT, Distributed Systems",
  },
  {
    id: 4,
    title: "QuizGo",
    description: "Modern quiz management platform built with Next.js and Firebase, designed specifically for educational institutions. It allows faculty members to create, manage and analyze quizzes while providing students with an intuitive interface to take assessments.",
    technologies: ["Next.js", "Firebase Auth", "Firebase Firestore", "Tailwind CSS", "React Hooks"],
    features: ["Teachers can create and set time limits for quizzes", "Bulk upload of questions using CSV, PDF, spreadsheets", "View and export student reports", "Dashboard to perform analysis of the quiz results", "Students can see the questin-wise breadown of results"],
    githubUrl: "https://github.com/suvanbanerjee/QuizGo",
    liveUrl: "https://dscequiz.vercel.app/",
    category: "Full Stack",
  },
];

const ProjectCard = ({ project, isCenter, isMobile }: { 
  project: Project; 
  isCenter: boolean;
  isMobile: boolean;
}) => {
  // On mobile, only show the center card
  if (isMobile && !isCenter) {
    return null;
  }

  return (
    <motion.div
      className={`flex-shrink-0 transition-all duration-700 ease-out ${
        isMobile 
          ? 'w-[90vw] max-w-[380px]' 
          : 'w-[28rem]'
      }`}
      animate={{
        scale: isMobile ? 1 : (isCenter ? 1.1 : 0.85),
        opacity: isMobile ? 1 : (isCenter ? 1 : 0.6),
        filter: isMobile ? "blur(0px)" : (isCenter ? "blur(0px)" : "blur(4px)"),
        y: isMobile ? 0 : (isCenter ? -20 : 10)
      }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 30,
        duration: 0.7
      }}
    >
      <div className={`relative group ${isMobile ? 'h-[550px]' : 'h-[600px]'}`}>
        {/* Main Card with Glassmorphism Effect */}
        <div className={`relative w-full h-full rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent before:-z-10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${isMobile ? 'flex flex-col' : ''}`}>
          {/* Header Section */}
          <div className={`border-b border-white/10 ${isMobile ? 'p-5' : 'p-6'} ${isMobile ? 'flex-shrink-0' : ''}`}>
            <div className={`flex items-center justify-between mb-4 ${isMobile ? 'flex-col items-start gap-3' : ''}`}>
              <div className="flex items-center gap-4">
                <div>
                  <h3 className={`font-semibold text-white leading-tight drop-shadow-lg ${isMobile ? 'text-xl' : 'text-xl'}`}>
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/90 text-sm rounded-full border border-white/20">
                      {project.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/30"
                  >
                    <Github size={18} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-indigo-500/30 backdrop-blur-sm hover:bg-indigo-500/50 text-white transition-all duration-200 border border-indigo-400/30 hover:border-indigo-400/60"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>
            <p className={`text-white/80 leading-relaxed mb-1 drop-shadow-sm ${isMobile ? 'text-sm' : 'text-sm'}`}>
              {project.description}
            </p>
          </div>

          {/* Content Area - Scrollable on Mobile, Static on Desktop */}
          {isMobile ? (
            // Mobile: Scrollable Content
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-white/5 hover:scrollbar-thumb-white/30 scroll-smooth">
              {/* Features and Achievements Grid */}
              <div className="border-b border-white/10 p-5">
                <div className="grid gap-6">
                  {/* Key Features */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2 drop-shadow-lg text-base">
                      Key Features
                    </h4>
                    <div className="space-y-3">
                      {project.features.map((feature, index) => (
                        <div key={index} className="text-white/80 flex items-start gap-3 drop-shadow-sm text-sm leading-relaxed">
                          <div className="w-1.5 h-1.5 bg-white/60 rounded-full shadow-sm mt-2 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technologies Section */}
              <div className="px-5 py-5">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2 drop-shadow-lg text-base">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-white/10 backdrop-blur-sm text-white/90 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-200 px-3 py-2 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Desktop: Static Content (Original Layout)
            <>
              {/* Features and Achievements Grid */}
              <div className="border-b border-white/10 p-6">
                <div className="grid gap-6">
                  {/* Key Features */}
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2 drop-shadow-lg">
                      Key Features
                    </h4>
                    <div className="space-y-2">
                      {project.features.map((feature, index) => (
                        <div key={index} className="text-white/80 flex items-center gap-2 drop-shadow-sm text-sm">
                          <div className="w-1 h-1 bg-white/60 rounded-full shadow-sm"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technologies Section */}
              <div className="pt-0 px-6 py-6">
                <h4 className="text-white font-medium py-4 flex items-center gap-2 drop-shadow-lg">
                  Technologies Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-white/10 backdrop-blur-sm text-white/90 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all duration-200 px-3 py-1 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}    
        </div>
      </div>
    </motion.div>
  );
};

export default function ScrollableProjects() {
  const [centerIndex, setCenterIndex] = useState(0); // Start with first project (id:1)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToProject = (index: number) => {
    setCenterIndex(index);
  };

  const handlePrevious = () => {
    const newIndex = centerIndex > 0 ? centerIndex - 1 : PROJECTS.length - 1;
    scrollToProject(newIndex);
  };

  const handleNext = () => {
    const newIndex = centerIndex < PROJECTS.length - 1 ? centerIndex + 1 : 0;
    scrollToProject(newIndex);
  };

  return (
    <div className="w-full py-8">
      <div className="relative max-w-7xl mx-auto">
        {/* Navigation Buttons with Glassmorphism */}
        <button
          onClick={handlePrevious}
          className={`absolute top-1/2 -translate-y-1/2 z-20 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 shadow-lg ${
            isMobile ? 'left-2 p-2' : 'left-4 p-3'
          }`}
        >
          <ChevronLeft size={isMobile ? 16 : 20} />
        </button>
        
        <button
          onClick={handleNext}
          className={`absolute top-1/2 -translate-y-1/2 z-20 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 shadow-lg ${
            isMobile ? 'right-2 p-2' : 'right-4 p-3'
          }`}
        >
          <ChevronRight size={isMobile ? 16 : 20} />
        </button>

        {/* Projects Carousel */}
        <div className="overflow-hidden px-8">
          <div className={`flex justify-center items-center ${isMobile ? 'min-h-[600px]' : 'min-h-[700px]'}`}>
            <motion.div
              className={`flex items-center ${isMobile ? 'gap-0' : 'gap-12'}`}
              animate={{
                x: isMobile 
                  ? 0 // Mobile: center the single card
                  : `calc(50vw - 224px - ${centerIndex * 496}px)` // Desktop: original carousel
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
                duration: 0.7
              }}
            >
              {PROJECTS.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isCenter={index === centerIndex}
                  isMobile={isMobile}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Mobile Project Indicator */}
        {isMobile && (
          <div className="flex justify-center mt-6 gap-2">
            {PROJECTS.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToProject(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === centerIndex 
                    ? 'bg-white/80 scale-125' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}