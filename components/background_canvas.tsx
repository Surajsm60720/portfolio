"use client";

import { useEffect, useState } from "react";

export default function BackgroundCanvas() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 h-full w-full bg-[#0a0a0a] overflow-hidden">
            {/* 1. Grain/Noise Overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '128px'
                }}
            />

            {/* 2. Ambient Gradient Mesh */}
            <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vh] rounded-full bg-indigo-900/10 blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vh] rounded-full bg-blue-900/10 blur-[120px]" />

            {/* 3. Mouse Follower Spot */}
            <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[100px] transition-transform duration-100 ease-out will-change-transform"
                style={{
                    left: mousePosition.x,
                    top: mousePosition.y,
                    width: "600px",
                    height: "600px"
                }}
            />

            <div className="hidden">
                {/* Preload fonts or other assets if needed, though Next.js handles fonts */}
            </div>
        </div>
    );
}
