import type { Metadata } from "next";
import "./globals.css";
import { SmoothMotion } from "@/components/Interactive";

export const metadata: Metadata = {
  metadataBase: new URL("https://4lph7.me"),
  title: {
    default: "ARUL G / 4LPH7 — Software Engineer",
    template: "%s · 4LPH7",
  },
  description: "The engineering portfolio of ARUL G: application security, cryptography, and practical software.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://4lph7.me",
    title: "ARUL G / 4LPH7",
    description: "Application security, cryptography, and practical software.",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "4LPH7 engineering portfolio" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.svg"] },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SmoothMotion />
        {children}
      </body>
    </html>
  );
}
