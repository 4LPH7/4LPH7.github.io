import { ArrowDown } from "lucide-react";
import { site } from "@/data/site";
import { HeroName } from "./HeroName";
import { Lanyard } from "./Lanyard";
import { Terminal } from "./Terminal";

const { hero } = site;

/** Text laid out around a circle with SVG textPath; the ring spins via CSS. */
function RotatingBadge() {
  return (
    <a className="badge" href="#about" aria-label="Scroll to About">
      <svg className="badge-ring" viewBox="0 0 120 120" aria-hidden="true">
        <defs><path id="badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
        <text><textPath href="#badge-circle" textLength="288">{hero.badge.repeat(2)}</textPath></text>
      </svg>
      <span className="badge-core"><ArrowDown size={20} strokeWidth={1.75} aria-hidden="true" /></span>
    </a>
  );
}

/** Full-viewport intro: hanging ID card (in front), interactive TechText name, tagline, typing terminal and scroll badge. */
export function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-bg" aria-hidden="true" />
      <Lanyard />
      <div className="hero-center">
        <h1 id="hero-title" className="hero-name">
          <HeroName text={site.name} />
          <span className="sr-only">{site.name}, {site.handle}</span>
        </h1>
        <p className="hero-lead">
          {hero.lead} <em>{hero.leadItalic}</em>
        </p>
      </div>
      <div className="hero-term">
        <Terminal prompt={hero.prompt} lines={hero.terminal} />
      </div>
      <RotatingBadge />
    </section>
  );
}
