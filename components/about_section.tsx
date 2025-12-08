"use client";

import ScrollReveal from "./ui/ScrollReveal";

export default function AboutSection() {
    return (
        <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">About</h2>
            </div>
            <div className="text-white/70 leading-relaxed">
                <p className="mb-4">
                    I am currently a final year student in Dept. of Information Science & Engg. at DSCE, Bengaluru.
                    With a strong foundation in both front-end and back-end technologies, I thrive on creating seamless user experiences and efficient server-side solutions.
                </p>
                <p>
                    I am dedicated to continuous learning and staying updated with the latest industry trends to deliver innovative solutions that meet client needs.
                </p>
            </div>
        </section>
    );
}
