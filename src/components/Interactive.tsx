"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type PointerEvent } from "react";
import { profile, projects } from "@/data/portfolio";

const commands: Record<string, string> = {
  help: "Commands: whoami · skills · projects · open github · clear",
  whoami: `${profile.name} / ${profile.handle} — ${profile.headline}`,
  skills: profile.skills.join(" · "),
  projects: projects.map((project) => project.title).join(" · "),
  "open github": "Opening github.com/4LPH7…",
};

export function Terminal() {
  const [output, setOutput] = useState("Type help to explore this local demo terminal.");
  const [value, setValue] = useState("");
  const input = useRef<HTMLInputElement>(null);

  function run(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = value.trim().toLowerCase();
    if (command === "clear") setOutput("");
    else if (command in commands) {
      setOutput((previous) => [previous, `$ ${command}`, commands[command]].filter(Boolean).slice(-4).join("\n"));
      if (command === "open github") window.open("https://github.com/4LPH7", "_blank", "noopener,noreferrer");
    } else setOutput((previous) => [previous, `$ ${command}`, "Command not found. Type help."].filter(Boolean).slice(-4).join("\n"));
    setValue("");
  }

  return (
    <div className="terminal">
      <div className="terminal-top">LOCAL DEMO · NO SHELL ACCESS</div>
      <div className="terminal-output" aria-live="polite">{output}</div>
      <form className="terminal-input-row" onSubmit={run}>
        <label htmlFor="terminal-command">›</label>
        <input ref={input} id="terminal-command" value={value} onChange={(event) => setValue(event.target.value)} autoComplete="off" spellCheck={false} aria-label="Enter a demo terminal command" />
        <button className="sr-only" type="submit">Run command</button>
      </form>
    </div>
  );
}

export function CursorRingField() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setPosition({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
  }

  return (
    <div
      className="cursor-ring-field"
      aria-hidden="true"
      onPointerMove={move}
      onPointerLeave={() => setPosition({ x: 0, y: 0 })}
      style={{ "--cursor-x": `${position.x}px`, "--cursor-y": `${position.y}px` } as CSSProperties}
    >
      <span />
      <span />
      <span />
    </div>
  );
}

const actions = [
  { label: "Selected work", hint: "Jump to projects", href: "#work" },
  { label: "About", hint: "Profile and skills", href: "#about" },
  { label: "Résumé", hint: "Open résumé", href: "/resume/" },
  { label: "GitHub", hint: "4LPH7 profile", href: "https://github.com/4LPH7" },
  { label: "Contact", hint: "Open GitHub profile", href: "https://github.com/4LPH7" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const visible = actions.filter((action) => action.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      searchRef.current?.focus();
    } else if (!open && dialog.open) dialog.close();
  }, [open]);

  function navigate(href: string) {
    setOpen(false);
    if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    else window.location.assign(href);
  }

  return (
    <>
      <button type="button" className="command-trigger" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="Open command palette">⌘K <kbd>QUICK NAV</kbd></button>
      <dialog ref={dialogRef} className="command-dialog" aria-label="Quick navigation" onClose={() => setOpen(false)}>
        <input ref={searchRef} className="command-search" placeholder="Search sections…" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Filter navigation commands" />
        <div className="command-list">
          {visible.map((action) => (
            <button type="button" className="command-item" key={action.label} onClick={() => navigate(action.href)}>
              <span>{action.label}</span><small>{action.hint}</small>
            </button>
          ))}
          {visible.length === 0 && <p className="card-label" role="status">No matching destinations.</p>}
        </div>
      </dialog>
    </>
  );
}

export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!enabled || !("AudioContext" in window)) return;
    const playTone = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("button, a, [role=button]") || target.closest("[data-sound-toggle]")) return;
      const context = contextRef.current ?? new AudioContext();
      contextRef.current = context;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 520;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.012, context.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.09);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.1);
    };
    document.addEventListener("click", playTone);
    return () => document.removeEventListener("click", playTone);
  }, [enabled]);

  useEffect(() => () => { void contextRef.current?.close(); }, []);
  return <button type="button" data-sound-toggle className="icon-button" onClick={() => setEnabled((previous) => !previous)} aria-pressed={enabled} aria-label={enabled ? "Mute interface sounds" : "Enable interface sounds"} title="Optional interface click tone">{enabled ? "SOUND ON" : "SOUND OFF"}</button>;
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="menu-toggle" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)}>{open ? "CLOSE" : "MENU"}</button>
      <nav id="primary-navigation" className="nav-links" data-open={open} aria-label="Primary navigation">
        <a href="#about" onClick={() => setOpen(false)}>About</a><a href="#work" onClick={() => setOpen(false)}>Work</a><a href="#research" onClick={() => setOpen(false)}>Research</a><a href="/resume/" onClick={() => setOpen(false)}>Résumé</a>
      </nav>
    </>
  );
}

export function SmoothMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;
    let disposed = false;
    let cleanup = () => {};
    void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(([lenisModule, gsapModule, scrollModule]) => {
      if (disposed) return;
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(".hero-image", { clipPath: "inset(0% 0% 0% 0%)", scrollTrigger: { trigger: ".hero-story", start: "top top", end: "bottom bottom", scrub: true } });
      gsap.to(".hero-content, .hero-caption, .hero-scroll", { autoAlpha: 0, y: -18, scrollTrigger: { trigger: ".hero-story", start: "top top", end: "bottom top", scrub: true } });
      const lenis = new lenisModule.default({ autoRaf: false, smoothWheel: true, lerp: 0.09 });
      const raf = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      gsap.utils.toArray<HTMLElement>(".project").forEach((card) => {
        gsap.fromTo(card, { y: 16, autoAlpha: 0.72 }, {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });
      });
      cleanup = () => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((trigger) => { trigger.kill(); });
      };
    }).catch(() => {
      // Native scrolling remains the functional fallback if optional motion code fails.
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);
  return null;
}
