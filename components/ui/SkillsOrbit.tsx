"use client";
import React, { useState, useEffect } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiFramer,
  SiGithub,
  SiPython,
  SiJavascript,
  SiMysql,
  SiGnubash,
  SiSupabase,
  SiGit,
  SiDocker,
  SiPostman,
  SiSqlite,
  SiFastapi,
  SiFirebase,
  SiShadcnui,
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

const SKILL_ICONS = [
  { icon: SiPython, color: "#306998", name: "Python" },
  { icon: SiReact, color: "#61DAFB", name: "React" },
  { icon: SiJavascript, color: "#F7DF1E", name: "JavaScript" },
  { icon: SiDocker, color: "#2496ED", name: "Docker" },
  { icon: SiTypescript, color: "#3178C6", name: "TypeScript" },
  { icon: SiSupabase, color: "#3ECF8E", name: "Supabase" },
  { icon: SiMysql, color: "#4479A1", name: "SQL" },
  { icon: SiNodedotjs, color: "#339933", name: "Node.js" },
  { icon: SiGnubash, color: "#4EAA25", name: "Bash" },
  { icon: VscCode, color: "#007ACC", name: "VS Code" },
  { icon: SiNextdotjs, color: "#ffffff", name: "Next.js" },
  { icon: SiTailwindcss, color: "#38B2AC", name: "Tailwind CSS" },
  { icon: SiFramer, color: "#0055FF", name: "Framer Motion" },
  { icon: SiSqlite, color: "#003B57", name: "SQLite" },
  { icon: SiGit, color: "#F05032", name: "Git" },
  { icon: SiFastapi, color: "#009688", name: "FastAPI" },
  { icon: SiGithub, color: "#ffffff", name: "GitHub" },
  { icon: SiPostman, color: "#EF5B25", name: "Postman" },
  { icon: SiFirebase, color: "#FFCA28", name: "Firebase" },
  { icon: SiShadcnui, color: "#2563EB", name: "shadcn/ui" },
];

interface SkillsOrbitProps {
  radius: number;
  centerX: number;
  centerY: number;
  count: number;
  iconSize: number;
  startIndex?: number;
  activeTooltip: string | null;
  setActiveTooltip: (id: string | null) => void;
  isMobile: boolean;
}

function SkillsOrbit({ radius, centerX, centerY, count, iconSize, startIndex = 0, activeTooltip, setActiveTooltip, isMobile }: SkillsOrbitProps) {
  const handleIconClick = (skillName: string) => {
    if (isMobile) {
      setActiveTooltip(activeTooltip === skillName ? null : skillName);
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / (count - 1)) * 180;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);
        const skillIndex = (startIndex + index) % SKILL_ICONS.length;
        const skill = SKILL_ICONS[skillIndex];
        const IconComponent = skill.icon;

        // Tooltip positioning — above or below based on angle
        const tooltipAbove = angle > 90;

        return (
          <div
            key={index}
            className="absolute flex flex-col items-center group skill-icon"
            style={{
              left: `${centerX + x - iconSize / 2}px`,
              top: `${centerY - y - iconSize / 2}px`,
              zIndex: 5,
            }}
          >
            <div
              className="flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-150"
              style={{
                width: iconSize,
                height: iconSize,
                padding: iconSize * 0.2
              }}
              onClick={() => handleIconClick(skill.name)}
            >
              <IconComponent
                size={iconSize * 0.8}
                color={skill.color}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
              />
            </div>

            {/* Tooltip */}
            <div
              className={`absolute ${tooltipAbove ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
                } ${isMobile
                  ? (activeTooltip === skill.name ? 'block' : 'hidden')
                  : 'hidden group-hover:block'
                } w-max rounded-lg bg-black/90 backdrop-blur-sm px-3 py-2 text-xs text-white shadow-xl text-center font-medium z-20`}
            >
              {skill.name}
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-black/90 ${tooltipAbove ? "top-full" : "bottom-full"
                  }`}
              ></div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function SkillsOrbitDisplay() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close tooltips when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobile && !target.closest('.skill-icon')) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile]);

  const baseWidth = Math.min(size.width * 0.8, 550);
  const centerX = baseWidth / 2;
  const centerY = baseWidth * 0.5;

  const iconSize =
    size.width < 480
      ? Math.max(40, baseWidth * 0.06)
      : size.width < 768
        ? Math.max(48, baseWidth * 0.07)
        : Math.max(56, baseWidth * 0.08);

  return (
    <div className="relative w-full flex justify-center">
      {/* Semi-circle glow background */}
      <div className="absolute inset-0 flex justify-center">
        <div
          className="
            w-[800px] h-[800px] rounded-full 
            bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_60%)]
            dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_60%)]
            blur-3xl 
            -mt-32 
            pointer-events-none
          "
          style={{ zIndex: 0 }}
        />
      </div>

      <div
        className="relative"
        style={{ width: baseWidth, height: baseWidth * 0.6 }}
      >
        <SkillsOrbit
          radius={baseWidth * 0.22}
          centerX={centerX}
          centerY={centerY}
          count={6}
          iconSize={iconSize}
          startIndex={0}
          activeTooltip={activeTooltip}
          setActiveTooltip={setActiveTooltip}
          isMobile={isMobile}
        />
        <SkillsOrbit
          radius={baseWidth * 0.36}
          centerX={centerX}
          centerY={centerY}
          count={8}
          iconSize={iconSize}
          startIndex={6}
          activeTooltip={activeTooltip}
          setActiveTooltip={setActiveTooltip}
          isMobile={isMobile}
        />
        <SkillsOrbit
          radius={baseWidth * 0.5}
          centerX={centerX}
          centerY={centerY}
          count={6}
          iconSize={iconSize}
          startIndex={14}
          activeTooltip={activeTooltip}
          setActiveTooltip={setActiveTooltip}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
}