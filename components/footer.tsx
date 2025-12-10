"use client";

export default function Footer() {
    return (
        <footer className="w-full py-1 text-sm text-white/40">
            <div className="flex flex-col gap-4 border-t border-white/10 pt-2">
                <div className="flex flex-col gap-2 mb-2">
                    <h3 className="text-white font-medium text-lg">Ready to create something?</h3>
                    <p>I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
                    <a href="mailto:surajmenon@example.com" className="text-teal-300 hover:text-teal-200 transition-colors w-max font-medium mt-2">
                        Say Hello →
                    </a>
                </div>
                <p className="mt-4">
                    &copy; {new Date().getFullYear()} Suraj Menon. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
