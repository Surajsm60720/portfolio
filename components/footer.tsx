"use client";

export default function Footer() {
    return (
        <footer className="w-full py-12 text-sm text-white/40">
            <div className="flex flex-col gap-4 border-t border-white/10 pt-8">
                <div className="flex flex-col gap-2 mb-4">
                    <h3 className="text-white font-medium text-lg">Ready to create something?</h3>
                    <p>I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
                    <a href="mailto:surajmenon@example.com" className="text-teal-300 hover:text-teal-200 transition-colors w-max font-medium mt-2">
                        Say Hello →
                    </a>
                </div>

                <p className="leading-relaxed">
                    Built with <span className="text-white font-medium">Next.js 15</span>, <span className="text-white font-medium">Tailwind CSS</span>, and <span className="text-white font-medium">Framer Motion</span>. Deployed on Vercel.
                    <br />
                    Typography set in <span className="text-white font-medium">Geist Sans</span> & <span className="text-white font-medium">Mono</span>.
                </p>
                <p className="mt-4">
                    &copy; {new Date().getFullYear()} Suraj Menon. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
