"use client";

import { ExternalLink, Github } from 'lucide-react';
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
  mediaUrl?: string;
  mediaType?: 'video' | 'image';
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "TravelEase",
    description: "Trip planner with in-built expense tracking for your trips and advanced map filterings to search places on the route.",
    technologies: ["React.js", "Google Maps API", "Supabase", "Framer Motion", "Tailwind CSS"],
    features: ["Expense planner", "Tourist attractions search", "Find restaurants/hotels", "Detailed place info", "Categorize expenses"],
    githubUrl: "https://github.com/Surajsm60720/TravelEase",
    liveUrl: "https://travel-ease-mocha.vercel.app/",
    category: "Full Stack",
    mediaType: "image",
    mediaUrl: "https://placehold.co/600x400/101010/FFF?text=TravelEase+Preview"
  },
  {
    id: 2,
    title: "Linux Starter Pack",
    description: "A simple CLI tool that allows users to install packages based on their Linux distribution. Has a built-in TUI.",
    technologies: ["Python", "Textual", "Next.js", "TypeScript", "Tailwind CSS"],
    features: ["Package manager auto-detect", "Dev tools pre-sets", "Categorized software", "Review commands", "Bash script generation"],
    githubUrl: "https://github.com/Surajsm60720/linux-starter-pack",
    liveUrl: "https://linuxstarterpack.vercel.app/",
    category: "CLI Tool",
    mediaType: "image",
    mediaUrl: "https://placehold.co/600x400/101010/FFF?text=Linux+Starter+Pack"
  },
  {
    id: 3,
    title: "NammaLakes",
    description: "IoT-powered distributed system designed to monitor the health and status of urban lakes.",
    technologies: ["React", "FastAPI", "RabbitMQ", "PostgreSQL", "MQTT", "Poetry"],
    features: ["Real-time Monitoring", "Anomaly detection", "Data visualization", "Alert system", "Multi-site support"],
    githubUrl: "https://github.com/NammaLakes",
    liveUrl: "https://nammalakes.github.io/",
    category: "IoT / Distributed Systems",
    mediaType: "image",
    mediaUrl: "https://placehold.co/600x400/101010/FFF?text=NammaLakes"
  },
  {
    id: 4,
    title: "QuizGo",
    description: "Modern quiz management platform built with Next.js and Firebase for educational institutions.",
    technologies: ["Next.js", "Firebase", "Tailwind CSS", "React Hooks"],
    features: ["Timed quizzes", "Bulk upload", "Student reports", "Analytics dashboard", "Result breakdown"],
    githubUrl: "https://github.com/suvanbanerjee/QuizGo",
    liveUrl: "https://dscequiz.vercel.app/",
    category: "Full Stack",
    mediaType: "image",
    mediaUrl: "https://placehold.co/600x400/101010/FFF?text=QuizGo"
  },
];

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col gap-4 rounded-lg bg-white/5 p-4 transition-colors hover:bg-white/10 lg:p-6"
    >
      {/* Media Section */}
      <div className="w-full h-48 sm:h-56 bg-black/20 overflow-hidden relative rounded-md border border-white/10">
        {project.mediaUrl && (
          project.mediaType === 'video' ? (
            <video
              src={project.mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
          ) : (
            <img
              src={project.mediaUrl}
              alt={project.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105"
            />
          )
        )}
        {!project.mediaUrl && (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
            No Preview
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium leading-tight text-white group-hover:text-teal-300">
            {project.title}
          </h3>
          <div className="flex gap-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">
                <Github size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-white/60">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech, i) => (
            <span key={i} className="rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function ScrollableProjects() {
  return (
    <div className="flex flex-col gap-12">
      {PROJECTS.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}