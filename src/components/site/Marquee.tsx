/** CSS-only marquee: content is duplicated so the -100% loop is seamless. */
export function Marquee({ children, speed = 30 }: { children: React.ReactNode; speed?: number }) {
  return (
    <div className="marquee" style={{ "--speed": `${speed}s` } as React.CSSProperties}>
      <div className="marquee-content">{children}</div>
      <div className="marquee-content" aria-hidden="true">{children}</div>
    </div>
  );
}
