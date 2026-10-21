"use client";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { site } from "@/data/site";
import { menuSocials } from "@/lib/menu";

// The overlay lists the six destinations; Stats is reachable by scrolling, like the reference.
const items = site.nav.filter((n) => n.id !== "stats").map((n, i) => ({ ...n, number: String(i + 1).padStart(2, "0") }));
const socials = menuSocials(site.socials);

/** Brand mark: the 4LPH7 logo, traced from public/splash.png so it stays crisp and follows the theme colour. */
export function BrandMark({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 317 318" width={size} height={size} aria-hidden="true" className="brand-mark">
      <path d="M174 4L178 6L177 43L71 148L131 149L131 177L4 177ZM175 70L178 72L177 225L149 251L148 97ZM199 149L312 149L313 153L149 314L148 277L248 178L194 177L194 150Z" />
    </svg>
  );
}

/**
 * Fixed header (brand, theme toggle, Menu +) and a staggered overlay: two coloured layers sweep in from the
 * right, then the panel, then the links rise one by one. The page behind dims, blurs and becomes inert.
 */
export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const first = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    document.documentElement.dataset.menu = open ? "open" : "closed";
    if (!open) return;
    const behind = [...document.querySelectorAll<HTMLElement>("main, footer, .skip-link")];
    for (const el of behind) el.inert = true;
    const lenis = (window as Window & { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => first.current?.focus({ preventScroll: true }), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      for (const el of behind) el.inert = false;
      lenis?.start();
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="nav">
        <a className="nav-brand" href="#home" aria-label={`${site.name}, back to top`}><BrandMark /></a>
        <div className="nav-actions">
          <ThemeToggle />
          <button ref={toggle} type="button" className="nav-toggle" data-open={open} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen((o) => !o)}>
            <span className="nav-toggle-text" aria-hidden="true"><span>Menu</span><span>Close</span></span>
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <Plus className="nav-toggle-icon" size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div className="menu" data-open={open}>
        <button type="button" className="menu-scrim" tabIndex={-1} aria-hidden="true" onClick={() => setOpen(false)} />
        <span className="menu-layer menu-layer-1" aria-hidden="true" />
        <span className="menu-layer menu-layer-2" aria-hidden="true" />
        <nav id="site-menu" className="menu-panel" aria-label="Primary" inert={!open}>
          <ol className="menu-links">
            {items.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <a ref={i === 0 ? first : undefined} href={item.href} onClick={() => setOpen(false)}>
                  <span className="menu-label">{item.label}</span>
                  <span className="menu-num">{item.number}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="menu-socials" style={{ "--i": items.length } as React.CSSProperties}>
            <h2>Socials</h2>
            <ul>
              {socials.map((s) => (
                <li key={s.label}><a href={s.href} target="_blank" rel="noreferrer">{s.label}</a></li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
