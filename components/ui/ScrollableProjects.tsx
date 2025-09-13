"use client";
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';
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
//   {
//     id: 2,
//     title: "Task Management App",
//     description: "Collaborative project management with real-time updates",
//     technologies: ["React", "Socket.io", "MongoDB", "Express", "TypeScript"],
//     features: ["Real-time Collaboration", "Drag & Drop Interface", "Team Workspaces", "Progress Tracking", "File Attachments"],
//     githubUrl: "https://github.com/yourusername/taskmanager",
//     liveUrl: "https://your-taskmanager.vercel.app",
//     category: "Frontend",
//   },
//   {
//     id: 3,
//     title: "Portfolio Website",
//     description: "Modern responsive portfolio with interactive animations",
//     technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
//     features: ["Interactive Animations", "Dark Mode Support", "Responsive Design", "Performance Optimized", "SEO Friendly"],
//     githubUrl: "https://github.com/yourusername/portfolio",
//     liveUrl: "https://your-portfolio.vercel.app",
//     category: "Frontend",
//   },
//   {
//     id: 4,
//     title: "Social Media Dashboard",
//     description: "Analytics platform for social media management",
//     technologies: ["React", "D3.js", "Python", "FastAPI", "PostgreSQL"],
//     features: ["Multi-platform Analytics", "Data Visualization", "Custom Reports", "Real-time Metrics", "Export Functionality"],
//     githubUrl: "https://github.com/yourusername/social-dashboard",
//     liveUrl: "https://your-dashboard.vercel.app",
//     category: "Full Stack",
//   },
//   {
//     id: 5,
//     title: "Blog CMS Platform",
//     description: "Content management system with SEO optimization",
//     technologies: ["Next.js", "Prisma", "PostgreSQL", "Tiptap", "NextAuth"],
//     features: ["Rich Text Editor", "SEO Optimization", "Multi-user Support", "Media Management", "Comment System"],
//     githubUrl: "https://github.com/yourusername/blog-cms",
//     liveUrl: "https://your-blog-cms.vercel.app",
//     category: "Full Stack",
//   }
];

const ProjectCard = ({ project, isCenter }: { 
  project: Project; 
  isCenter: boolean; 
}) => {
  return (
    <motion.div
      className="flex-shrink-0 w-[28rem] transition-all duration-700 ease-out"
      animate={{
        scale: isCenter ? 1.1 : 0.85,
        opacity: isCenter ? 1 : 0.6,
        filter: isCenter ? "blur(0px)" : "blur(4px)",
        y: isCenter ? -20 : 10
      }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 30,
        duration: 0.7
      }}
    >
      <div className="relative h-[600px] group">
        {/* Main Card with Dark Theme - Wider and Shorter */}
        <div className="relative w-full h-full rounded-2xl backdrop-blur-md bg-black/95 border border-gray-800 shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
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
                    className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all duration-200"
                  >
                    <Github size={18} />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-1">
              {project.description}
            </p>
            </div>

          {/* Features and Achievements Grid */}
          <div className="p-6 border-b border-gray-800">
            <div className="grid gap-6">
              {/* Key Features */}
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  Key Features
                </h4>
                <div className="space-y-2">
                  {project.features.map((feature, index) => (
                    <div key={index} className="text-gray-400 text-sm flex items-center gap-2">
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Technologies Section */}
          <div className="px-6 py-6 pt-0">
            <h4 className="text-white font-medium py-4 flex items-center gap-2">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>    
        </div>
      </div>
    </motion.div>
  );
};

export default function ScrollableProjects() {
  const [centerIndex, setCenterIndex] = useState(Math.floor(PROJECTS.length / 2)); // Start with middle project centered
  const scrollRef = useRef<HTMLDivElement>(null);

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
        {/* Navigation Buttons with Dark Theme */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/90 border border-gray-800 text-white hover:bg-black hover:border-gray-700 transition-all duration-200 shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/90 border border-gray-800 text-white hover:bg-black hover:border-gray-700 transition-all duration-200 shadow-lg"
        >
          <ChevronRight size={20} />
        </button>

        {/* Projects Carousel */}
        <div className="overflow-hidden px-8">
          <div className="flex justify-center items-center min-h-[700px]">
            <motion.div
              className="flex gap-12 items-center"
              animate={{
                x: -(centerIndex * 496) + (496 * Math.floor(PROJECTS.length / 2)) // Updated for w-[28rem] (448px) + 48px gap
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
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}