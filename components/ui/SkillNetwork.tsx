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
            const { clientWidth } = containerRef.current;

            // Responsive columns based on width
            const cols = clientWidth < 400 ? 3 : clientWidth < 600 ? 4 : 5;
            const rows = Math.ceil(SKILLS.length / cols);

            // Calculate height based on rows (each row ~100px on mobile, ~120px on desktop)
            const rowHeight = clientWidth < 600 ? 90 : 120;
            const calculatedHeight = rows * rowHeight + 60; // Extra padding

            setDimensions({ width: clientWidth, height: calculatedHeight });

            // Recalculate node positions on resize
            const cellWidth = clientWidth / (cols + 1);
            const cellHeight = calculatedHeight / (rows + 1);

            if (nodesRef.current.length === 0) {
                nodesRef.current = SKILLS.map((_, i) => {
                    const col = i % cols;
                    const row = Math.floor(i / cols);
                    const anchorX = (col + 1) * cellWidth + (Math.random() - 0.5) * 20;
                    const anchorY = (row + 1) * cellHeight + (Math.random() - 0.5) * 20;

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
            } else {
                // Update anchor positions on resize
                nodesRef.current = nodesRef.current.map((node, i) => {
                    const col = i % cols;
                    const row = Math.floor(i / cols);
                    const anchorX = (col + 1) * cellWidth;
                    const anchorY = (row + 1) * cellHeight;

                    return {
                        ...node,
                        anchorX,
                        anchorY,
                        x: anchorX,
                        y: anchorY,
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
                    // Only do subtle idle drift when very close to anchor
                    const dx = node.anchorX - node.x;
                    const dy = node.anchorY - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Small threshold for idle animation
                    if (distance < 5) {
                        // Subtle random drift for ambient movement
                        node.vx += (Math.random() - 0.5) * 0.15;
                        node.vy += (Math.random() - 0.5) * 0.15;

                        // Gentle spring back
                        node.vx += dx * 0.05;
                        node.vy += dy * 0.05;

                        node.vx *= 0.9;
                        node.vy *= 0.9;

                        node.x += node.vx;
                        node.y += node.vy;
                    }
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
            const node = nodesRef.current[dragStateRef.current.nodeIndex];
            const iconEl = iconRefs.current[dragStateRef.current.nodeIndex];

            // Add transition class for smooth return
            if (iconEl) {
                iconEl.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                iconEl.style.transform = `translate3d(${node.anchorX - 28}px, ${node.anchorY - 28}px, 0)`;

                // Remove transition after animation completes
                setTimeout(() => {
                    if (iconEl) iconEl.style.transition = '';
                }, 300);
            }

            // Reset node position and state
            node.x = node.anchorX;
            node.y = node.anchorY;
            node.vx = 0;
            node.vy = 0;
            node.isDragging = false;
            dragStateRef.current.nodeIndex = null;
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden"
            style={{ height: dimensions.height > 0 ? `${dimensions.height}px` : '500px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none " />

            {SKILLS.map((skill, i) => (
                <div
                    key={i}
                    ref={(el) => { iconRefs.current[i] = el; }}
                    className="absolute top-0 left-0 flex flex-col items-center z-10 will-change-transform group cursor-grab active:cursor-grabbing"
                    style={{ transform: 'translate3d(-100px, -100px, 0)' }}
                    onMouseDown={(e) => handleMouseDown(e, i)}
                >
                    {/* Icon Circle - smaller on mobile */}
                    <div className="w-11 h-11 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black/10 backdrop-blur-sm border border-white/20 shadow-lg transition-shadow hover:shadow-xl hover:shadow-indigo-500/20">
                        <skill.icon
                            size={dimensions.width < 400 ? 18 : 24}
                            color={skill.color}
                            className="transition-transform duration-300 group-hover:scale-125 pointer-events-none"
                        />
                    </div>

                    {/* Always visible skill name */}
                    <span className="mt-1 text-[9px] sm:text-[10px] font-medium text-white/70 text-center whitespace-nowrap group-hover:text-white transition-colors">
                        {skill.name}
                    </span>
                </div>
            ))}

            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[160px] -z-10 opacity-0" />
        </div>
    );
}
