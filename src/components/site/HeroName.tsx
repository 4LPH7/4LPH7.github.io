"use client";

import TechText from "@/components/reactbits/TechText/TechText";

/**
 * The hero wordmark: React Bits TechText in Sanchez.
 */
export function HeroName({ text }: { text: string }) {
  return (
    <span className="hero-wordmark" aria-hidden="true">
      <TechText
        text={text.toUpperCase()}
        fontFamily="Sanchez, Georgia, serif"
        fontWeight={400}
        fontSize={110}
        letterSpacing={0.04}
        accentColor="#3b82f6"
        reveal="letter"
        dashLength={4}
        dashGap={2}
        specks={15}
        intro="none"
        introDuration={2}
        clickKick
        guides={false}
        bounds=".hero"
      />
    </span>
  );
}
