import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Karla, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PREPAINT_SCRIPT } from "@/lib/theme";
import { identity } from "@/lib/content";

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const body = Karla({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sets data-theme before first paint. No flash. See lib/theme.ts. */}
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
