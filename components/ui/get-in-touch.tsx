"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export const ProfessionalConnect = () => {
  const [, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const socialPlatforms = [
    {
      name: 'LinkedIn',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      gradient: 'from-blue-600 to-blue-400',
      shadowColor: 'rgba(59, 130, 246, 0.5)',
      link: 'https://www.linkedin.com/in/suraj-menon-a581ab305/',
      description: 'Professional Network'
    },
    {
      name: 'GitHub',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      gradient: 'from-gray-700 to-gray-500',
      shadowColor: 'rgba(75, 85, 99, 0.5)',
      link: 'https://github.com/Surajsm60720',
      description: 'Code Repository'
    },
    {
      name: 'Twitter',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      gradient: 'from-slate-800 to-slate-600',
      shadowColor: 'rgba(51, 65, 85, 0.5)',
      link: 'https://x.com/surajsm223',
      description: 'Social Updates'
    },
    {
      name: 'Instagram',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
        </svg>
      ),
      gradient: 'from-purple-600 via-pink-600 to-orange-500',
      shadowColor: 'rgba(219, 39, 119, 0.5)',
      link: 'https://www.instagram.com/stargazer60720/',
      description: 'Visual Stories'
    },
    {
      name: 'Resume',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      ),
      gradient: 'from-emerald-600 to-teal-500',
      shadowColor: 'rgba(16, 185, 129, 0.5)',
      link: '/cv.pdf',
      description: 'Download CV'
    },
    {
      name: 'Email',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
        </svg>
      ),
      gradient: 'from-orange-500 to-red-500',
      shadowColor: 'rgba(249, 115, 22, 0.5)',
      link: 'mailto:surajsm218@gmail.com',
      description: 'Send Message'
    }
  ];

  return (
    <div className="overflow-hidden relative w-full">
        {/* Social Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {socialPlatforms.map((platform, index) => (
            <a
              key={platform.name}
              href={platform.link}
              target={platform.name === 'Resume' ? '_blank' : '_self'}
              rel={platform.name === 'Resume' ? 'noopener noreferrer' : undefined}
              className={`group relative transition-all duration-700 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card Container */}
              <div className="relative w-full h-40 p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:bg-gradient-to-br before:from-white/20 before:via-white/5 before:to-transparent before:-z-10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
                {/* Hover Gradient Effect */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${platform.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>
                
                {/* Enhanced Glow Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${platform.shadowColor}, transparent 60%)`,
                  }}
                ></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  {/* Icon and Title Row */}
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${platform.gradient} text-white transform transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110 shadow-lg`}>
                      {platform.icon}
                    </div>
                    
                    {/* Arrow Icon */}
                    <div className="flex items-center text-white/60 group-hover:text-white transition-all duration-300">
                      <svg 
                        className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="mt-3">
                    <h3 className="text-white font-semibold text-lg mb-1 transition-colors duration-300 drop-shadow-lg">
                      {platform.name}
                    </h3>
                    <p className="text-white/70 text-sm transition-colors duration-300 group-hover:text-white/90 drop-shadow-sm">
                      {platform.description}
                    </p>
                  </div>
                </div>

                {/* Enhanced Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>
            </a>
          ))}
        </div>

        {/* Simple Footer with Top Border */}
        <div className="mt-32 max-w-3xl mx-auto">
          {/* Top border line with glassmorphism */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>
          
          {/* Footer text */}
          <div className="text-center pb-8">
            <h3 className="text-white font-semibold text-lg mb-3 drop-shadow-lg">
              Let&apos;s Connect & Collaborate
            </h3>
            <p className="text-white/80 text-sm leading-relaxed drop-shadow-sm max-w-2xl mx-auto">
              Whether you&apos;re looking to discuss a project, explore collaboration opportunities, 
              or just want to say hello, I&apos;m always open to connecting with fellow developers, 
              designers, and innovators. Feel free to reach out through any of the platforms above!
            </p>
            <p className="text-white/80 text-sm leading-relaxed drop-shadow-sm max-w-2xl mx-auto">
              Made using some exceptionally cool components from <Link href="https://21st.dev" className="underline">21st.dev</Link> and <Link href="https://reactbits.dev" className="underline">reactbits.dev</Link>
            </p>
          </div>
        </div>

      {/* Mouse Follow Light */}
      <div 
        className="pointer-events-none fixed w-96 h-96 rounded-full opacity-20 blur-[100px] transition-all duration-200 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3), transparent)',
          left: `${mousePosition.x - 192}px`,
          top: `${mousePosition.y - 192}px`,
        }}
      />
    </div>
  );
};