"use client";
import { GlowingEffect } from "./ui/glowing-effect";
import { cn } from "@/lib/utils";
import SplitText from "./ui/SplitText";
import { ProfessionalConnect } from "./ui/get-in-touch";

export default function ContactSection() {
  return (
    <div className="container mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <SplitText
            text="Contact Me"
            className="text-7xl font-bold text-center pb-12 py-30"
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
        <div className="py-8 w-full">
          < ProfessionalConnect />
        </div>
    </div>
  );
}