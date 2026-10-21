"use client";

import SignalType from "@/components/SignalType";

/**
 * The hero wordmark: Signal Type neon flicker reveal in Sanchez.
 */
export function HeroName({ text }: { text: string }) {
  return (
    <span className="hero-wordmark" aria-hidden="true">
      <SignalType as="span" variant="blue">
        {text.toUpperCase()}
      </SignalType>
    </span>
  );
}
