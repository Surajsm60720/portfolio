"use client";

export default function AboutSection() {
    return (
        <section id="about" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white">About</h2>
            </div>
            <div className="text-white/70 leading-relaxed">
                <p>
                    I&apos;m the type who builds things for fun — whether that&apos;s a trip planner at 2 AM or an IoT system to track lake pollution. I get excited about turning messy problems into clean, fast interfaces. Outside of code, I&apos;m probably gaming, hunting for new music tracks, or deep in a rabbit hole learning something I&apos;ll definitely use &quot;someday.&quot; I believe great software should feel invisible — if you notice the UX, something went wrong.
                </p>
            </div>
        </section>
    );
}
