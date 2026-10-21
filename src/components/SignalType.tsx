"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import "./SignalType.css";

export interface SignalTypeProps {
  children?: ReactNode;
  as?: ElementType;
  variant?: "blue" | "green";
  color?: string;
  glowColor?: string;
  className?: string;
  style?: CSSProperties;
}

export default function SignalType({
  children = "SYSTEM ONLINE",
  as: Component = "span",
  variant = "blue",
  color,
  glowColor,
  className = "",
  style,
}: SignalTypeProps) {
  const customStyle: CSSProperties = {
    ...(color ? ({ "--signal-color": color } as CSSProperties) : {}),
    ...(glowColor ? ({ "--signal-glow": glowColor } as CSSProperties) : {}),
    ...style,
  };

  const variantClass = variant === "green" ? "signal-type--green" : "signal-type--blue";

  return (
    <Component
      className={`signal-type ${variantClass} ${className}`.trim()}
      style={customStyle}
    >
      {children}
    </Component>
  );
}
