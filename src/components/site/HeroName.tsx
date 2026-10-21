"use client";

import DecryptedText from "@/components/reactbits/DecryptedText/DecryptedText";

/**
 * The hero wordmark: React Bits DecryptedText in Unbounded.
 */
export function HeroName({ text }: { text: string }) {
  return (
    <span className="hero-wordmark" aria-hidden="true">
      <DecryptedText
        text={text}
        animateOn="inViewHover"
        effect="scramble"
        sequential={true}
        revealDirection="start"
        speed={60}
        maxIterations={10}
        hoverRadius={100}
        scrambleColor="#3b82f6"
        loop={false}
        useOriginalCharsOnly={false}
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+"
        className="revealed"
        encryptedClassName="encrypted"
      />
    </span>
  );
}

