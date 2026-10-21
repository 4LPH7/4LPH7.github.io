import type { Heading } from "@/data/site";

/** "01 —— ABOUT" eyebrow plus a serif heading whose second half is muted italic. */
export function SectionHeading({ num, heading, id, className = "" }: { num: string; heading: Heading; id: string; className?: string }) {
  return (
    <header className={`sh ${className}`}>
      <p className="sh-eyebrow" data-reveal>
        <span className="sh-num">{num}</span>
        <span className="sh-rule" aria-hidden="true" />
        <span>{heading.label}</span>
      </p>
      <h2 id={id} className="sh-title" data-reveal>
        {heading.plain} <em>{heading.italic}</em>
      </h2>
    </header>
  );
}
