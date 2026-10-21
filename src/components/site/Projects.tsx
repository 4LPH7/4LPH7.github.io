"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { pickDirection, step, swipeDelta } from "@/lib/carousel";
import { SectionHeading } from "./SectionHeading";

const list = site.projects;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Project browser: numbered list on the left (chips on phones), detail card on the right.
 * Arrow keys work anywhere in the section, the card swipes, and dots jump straight to a project.
 */
export function Projects() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<-1 | 0 | 1>(0); // 0 until the first interaction, so nothing animates on load
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const p = list[i];

  const go = useCallback((d: -1 | 1) => { setDir(d); setI((n) => step(n, d, list.length)); }, []);
  const pick = (n: number) => { setDir(pickDirection(i, n)); setI(n); };

  // Keep the active chip visible in the horizontal phone strip.
  // Only the strip scrolls; scrollIntoView would also move the page.
  useEffect(() => {
    const chip = chips.current[i];
    const strip = chip?.closest<HTMLElement>(".plist");
    if (!chip || !strip || strip.scrollWidth <= strip.clientWidth) return;
    const left = chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2;
    strip.scrollTo({ left, behavior: dir ? "smooth" : "auto" });
  }, [i, dir]);

  useEffect(() => {
    const section = root.current;
    const el = stage.current;
    if (!section || !el) return;
    let startX: number | null = null;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    };
    const down = (e: PointerEvent) => { if (!(e.target as HTMLElement).closest("a, button")) startX = e.clientX; };
    const up = (e: PointerEvent) => {
      const from = startX;
      startX = null;
      if (from === null) return;
      const d = swipeDelta(from, e.clientX);
      if (d) go(d);
    };
    const cancel = () => { startX = null; };
    section.addEventListener("keydown", onKey);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", cancel);
    return () => {
      section.removeEventListener("keydown", onKey);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", cancel);
    };
  }, [go]);

  return (
    <section ref={root} id="projects" className="projects" aria-labelledby="projects-title" aria-roledescription="carousel">
      <div className="projects-head">
        <SectionHeading num="02" heading={site.headings.projects} id="projects-title" />
        <p className="projects-count mono" aria-hidden="true">{pad(i + 1)} / {pad(list.length)}</p>
      </div>

      <div className="projects-body">
        <ol className="plist" aria-label="Projects">
          {list.map((x, n) => (
            <li key={x.id}>
              <button ref={(el) => { chips.current[n] = el; }} type="button" aria-current={n === i} onClick={() => pick(n)}>
                <span className="plist-num mono">{pad(n + 1)}</span>
                <span className="plist-title">{x.title}</span>
                <span className="plist-tag mono">{x.tags[0]}</span>
              </button>
            </li>
          ))}
        </ol>

        <div ref={stage} className="pcard card" data-reveal>
          {/* biome-ignore lint/a11y/useSemanticElements: the ARIA carousel pattern marks slides role="group"; a fieldset is for form controls. */}
          <div key={p.id} className="pcard-slide" data-dir={dir || undefined} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${list.length}: ${p.title}`} aria-live="polite">
            <span className="pcard-ghost" aria-hidden="true">{pad(i + 1)}</span>
            <p className="eyebrow pcard-eyebrow"><i aria-hidden="true" />PROJECT {pad(i + 1)} / {pad(list.length)}</p>
            <p className="pcard-slug mono">/{p.id}</p>
            <h3 className="pcard-title">{p.title}</h3>
            <p className="pcard-summary">{p.summary}</p>
            <ul className="tags">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="pcard-foot">
            <div className="pcard-nav">
              <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label="Previous project"><ArrowLeft size={17} aria-hidden="true" /></button>
              <button type="button" className="icon-btn" onClick={() => go(1)} aria-label="Next project"><ArrowRight size={17} aria-hidden="true" /></button>
              <div className="dots">
                {list.map((x, n) => (
                  <button key={x.id} type="button" className="dot" aria-current={n === i} aria-label={`Go to ${x.title}`} onClick={() => pick(n)} />
                ))}
              </div>
            </div>
            {p.repoUrl ? (
              <a className="btn-light" href={p.repoUrl} target="_blank" rel="noreferrer">Open project <ArrowUpRight size={15} aria-hidden="true" /></a>
            ) : (
              <span className="btn-ghost" aria-disabled="true">Repo coming soon</span>
            )}
          </div>
        </div>
      </div>
      <p className="hint">CLICK A PROJECT · USE ← → · OR SWIPE</p>
    </section>
  );
}
