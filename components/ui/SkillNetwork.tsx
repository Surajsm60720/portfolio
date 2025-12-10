"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiFramer,
    SiGithub, SiPython, SiJavascript, SiMysql, SiGnubash, SiSupabase,
    SiGit, SiDocker, SiPostman, SiSqlite, SiFastapi, SiFirebase, SiShadcnui
} from "react-icons/si";
import { VscCode } from "react-icons/vsc";

const SKILLS = [
    { icon: SiReact, color: "#61DAFB", name: "React", category: "frontend" },
    { icon: SiNextdotjs, color: "#ffffff", name: "Next.js", category: "frontend" },
    { icon: SiTypescript, color: "#3178C6", name: "TypeScript", category: "language" },
    { icon: SiTailwindcss, color: "#38B2AC", name: "Tailwind", category: "frontend" },
    { icon: SiNodedotjs, color: "#339933", name: "Node.js", category: "backend" },
    { icon: SiPython, color: "#306998", name: "Python", category: "language" },
    { icon: SiJavascript, color: "#F7DF1E", name: "JavaScript", category: "language" },
    { icon: SiDocker, color: "#2496ED", name: "Docker", category: "devops" },
    { icon: SiSupabase, color: "#3ECF8E", name: "Supabase", category: "backend" },
    { icon: SiMysql, color: "#4479A1", name: "SQL", category: "database" },
    { icon: SiFramer, color: "#0055FF", name: "Motion", category: "frontend" },
    { icon: SiGit, color: "#F05032", name: "Git", category: "devops" },
    { icon: SiGithub, color: "#ffffff", name: "GitHub", category: "devops" },
    { icon: VscCode, color: "#007ACC", name: "VS Code", category: "tools" },
    { icon: SiFastapi, color: "#009688", name: "FastAPI", category: "backend" },
    { icon: SiFirebase, color: "#FFCA28", name: "Firebase", category: "backend" },
    { icon: SiPostman, color: "#EF5B25", name: "Postman", category: "tools" },
    { icon: SiShadcnui, color: "#2563EB", name: "Shadcn", category: "frontend" },
    { icon: SiGnubash, color: "#4EAA25", name: "Bash", category: "devops" },
    { icon: SiSqlite, color: "#003B57", name: "SQLite", category: "database" },
];

interface Node {
    id: number;
    anchorX: number;
    anchorY: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    isDragging: boolean;
}

export default function SkillNetwork() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodesRef = useRef<Node[]>([]);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
    const dragStateRef = useRef<{ nodeIndex: number | null; offsetX: number; offsetY: number }>({
        nodeIndex: null,
        offsetX: 0,
        offsetY: 0,
    });

    // Initialize nodes in a scattered but organized layout
    useEffect(() => {
        if (!containerRef.current) return;

        const updateDimensions = () => {
            if (!containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;
            setDimensions({ width: clientWidth, height: clientHeight });

            if (nodesRef.current.length === 0) {
                // Distribute nodes in a loose grid
                const cols = 5;
                const rows = Math.ceil(SKILLS.length / cols);
                const cellWidth = clientWidth / (cols + 1);
                const cellHeight = clientHeight / (rows + 1);

                nodesRef.current = SKILLS.map((_, i) => {
                    const col = i % cols;
                    const row = Math.floor(i / cols);
                    const anchorX = (col + 1) * cellWidth + (Math.random() - 0.5) * 40;
                    const anchorY = (row + 1) * cellHeight + (Math.random() - 0.5) * 40;

                    return {
                        id: i,
                        anchorX,
                        anchorY,
                        x: anchorX,
                        y: anchorY,
                        vx: 0,
                        vy: 0,
                        isDragging: false,
                    };
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Animation loop
    useEffect(() => {
        if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${dimensions.width}px`;
        canvas.style.height = `${dimensions.height}px`;

        const nodes = nodesRef.current;

        const animate = () => {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            nodes.forEach((node, i) => {
                if (!node.isDragging) {
                    // Magnetic spring force pulling back to anchor
                    const dx = node.anchorX - node.x;
                    const dy = node.anchorY - node.y;
                    const springStrength = 0.05; // How strong the pull is

                    node.vx += dx * springStrength;
                    node.vy += dy * springStrength;

                    // Add subtle random drift
                    node.vx += (Math.random() - 0.5) * 0.1;
                    node.vy += (Math.random() - 0.5) * 0.1;

                    // Damping
                    node.vx *= 0.9;
                    node.vy *= 0.9;

                    node.x += node.vx;
                    node.y += node.vy;
                }

                // Update DOM position
                const iconEl = iconRefs.current[i];
                if (iconEl) {
                    iconEl.style.transform = `translate3d(${node.x - 28}px, ${node.y - 28}px, 0)`;
                }
            });

            // Draw connections between nearby nodes
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.lineWidth = 1;

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distSq = dx * dx + dy * dy;
                    const maxDistSq = 25000; // ~158px

                    if (distSq < maxDistSq) {
                        const opacity = 1 - Math.sqrt(distSq) / Math.sqrt(maxDistSq);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 1})`;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [dimensions]);

    const handleMouseDown = (e: React.MouseEvent, nodeIndex: number) => {
        e.preventDefault();
        nodesRef.current[nodeIndex].isDragging = true;

        const node = nodesRef.current[nodeIndex];
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        dragStateRef.current = {
            nodeIndex,
            offsetX: e.clientX - rect.left - node.x,
            offsetY: e.clientY - rect.top - node.y,
        };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (dragStateRef.current.nodeIndex === null) return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const node = nodesRef.current[dragStateRef.current.nodeIndex];
        node.x = e.clientX - rect.left - dragStateRef.current.offsetX;
        node.y = e.clientY - rect.top - dragStateRef.current.offsetY;
        node.vx = 0;
        node.vy = 0;
    };

    const handleMouseUp = () => {
        if (dragStateRef.current.nodeIndex !== null) {
            nodesRef.current[dragStateRef.current.nodeIndex].isDragging = false;
            dragStateRef.current.nodeIndex = null;
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[600px] overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none " />

            {SKILLS.map((skill, i) => (
                <div
                    key={i}
                    ref={(el) => { iconRefs.current[i] = el; }}
                    className="absolute top-0 left-0 w-14 h-14 flex items-center justify-center rounded-full bg-black/10 backdrop-blur-sm border border-white/20 shadow-lg z-10 will-change-transform group cursor-grab active:cursor-grabbing transition-shadow hover:shadow-xl hover:shadow-indigo-500/20"
                    style={{ transform: 'translate3d(-100px, -100px, 0)' }}
                    onMouseDown={(e) => handleMouseDown(e, i)}
                >
                    <skill.icon
                        size={24}
                        color={skill.color}
                        className="transition-transform duration-300 group-hover:scale-125 pointer-events-none"
                    />

                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 backdrop-blur-md rounded-lg text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
                        {skill.name}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 rotate-45 bg-black/90 border-r border-b border-white/10" />
                    </div>
                </div>
            ))}

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px] -z-10 opacity-0" />
        </div>
    );
}
