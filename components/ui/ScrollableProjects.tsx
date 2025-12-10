"use client";

import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import travelease from "../Assets/travelease.png";
import linux_starter_pack from "../Assets/lsp.png";
import nammalakes from "../Assets/nammalakes.png";
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  mediaUrl?: string | StaticImageData;
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
    mediaUrl: travelease
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
    mediaUrl: linux_starter_pack
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
    mediaUrl: nammalakes
  },
];

const ProjectCard = ({ project }: { project: Project }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 lg:p-6 overflow-hidden"
    >
      {/* Spotlight Overlay */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.1), transparent 40%)`,
        }}
      />

      {/* Media Section */}
      <div className="w-full h-48 sm:h-56 bg-black/20 overflow-hidden relative rounded-md z-10">
        {project.mediaUrl ? (
          project.mediaType === 'video' ? (
            <video
              src={typeof project.mediaUrl === 'string' ? project.mediaUrl : ''}
              muted
              loop
              autoPlay
              playsInline
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg"
            />
          ) : (
            typeof project.mediaUrl === 'string' ? (
              <img
                src={project.mediaUrl}
                alt={project.title}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg"
              />
            ) : (
              <Image
                src={project.mediaUrl}
                alt={project.title}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105 rounded-lg"
              />
            )
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
            No Preview
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
            {project.title}
          </h3>
          <div className="flex gap-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><Github size={18} /></a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors"><ExternalLink size={18} /></a>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-white/60">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {project.technologies.map((tech, i) => (
            <span
              key={i}
              className="rounded-full bg-teal-400/10 px-2.5 py-0.5 text-xs font-medium text-teal-300 ring-1 ring-inset ring-teal-400/20"
            >
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