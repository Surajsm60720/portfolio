import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

/* Loaded for console mode only. The ordinary page uses the system stacks;
   these are the 8-bit half, and self-hosting them keeps the no-third-party
   rule intact. */
const pixel = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const crt = VT323({
  variable: "--font-crt",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
import { PREPAINT_SCRIPT } from "@/lib/theme";
import { identity } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL("https://surajmenon.vercel.app"),
  title: `${identity.name} — ${identity.role}`,
  description: `${identity.thesis} ${identity.thesisNote}`,
  openGraph: {
    title: `${identity.name} — ${identity.role}`,
    description: `${identity.thesis} ${identity.thesisNote}`,
    url: "/",
    siteName: identity.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${identity.name} — ${identity.role}`,
    description: `${identity.thesis} ${identity.thesisNote}`,
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#08090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* On <html>, not <body>: globals.css composes its type tokens at :root,
       and a var() there cannot see a variable declared further down. */
    <html
      lang="en"
      suppressHydrationWarning
      className={`${pixel.variable} ${crt.variable}`}
    >
      <head>
        {/* Sets data-theme before first paint. No flash. See lib/theme.ts. */}
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
