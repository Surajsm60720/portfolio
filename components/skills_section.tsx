"use client";
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
  SiFastapi
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";
import SplitText from "./ui/SplitText";
import IconMarquee from "./ui/IconMarquee";

export default function SkillsSection() {
  return (
    <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <SplitText
            text="Skills & Technologies"
            className="text-7xl font-bold text-center pb-8"
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
        <div className="w-full">
          <IconMarquee speed={80} direction="left">
            <SiPython size={48} color="#306998" title="Python" />
            <SiReact size={48} color="#61DAFB" title="React" />
            <SiJavascript size={48} color="#F7DF1E" title="JavaScript" />
            <SiDocker size={48} color="#2496ED" title="Docker" />
            <SiTypescript size={48} color="#3178C6" title="TypeScript" />
            <SiSupabase size={48} color="#3ECF8E" title="Supabase" />
            <SiMysql size={48} color="#4479A1" title="SQL" />
            <SiNodedotjs size={48} color="#339933" title="Node.js" />
            <SiGnubash size={48} color="#4EAA25" title="Bash" />
            <VscCode size={48} color="#007ACC" title="VS Code" />
            <SiNextdotjs size={48} color="#fffefeff" title="Next.js" />
            <SiTailwindcss size={48} color="#38B2AC" title="Tailwind CSS" />
            <SiFramer size={48} color="#0055FF" title="Framer Motion" />
            <SiSqlite size={48} color="#003B57" title="SQLite" />
            <SiGit size={48} color="#F05032" title="Git" />
            <SiFastapi size={48} color="#009688" title="FastAPI" />
            <SiGithub size={48} color="#fff2f2ff" title="GitHub" />
            <SiPostman size={48} color="#EF5B25" title="Postman" />
          </IconMarquee>
        </div>
    </div>
  );
};

