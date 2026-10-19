import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { CommandPalette, CursorRingField, MobileNav, SoundToggle, Terminal } from "@/components/Interactive";
import { links, profile, projects, research } from "@/data/portfolio";

const imageCredits = [
  ["Fog across a quiet lake", "https://www.rawpixel.com/image/5907336/photo-image-public-domain-nature-water"],
  ["Trees in a misty landscape", "https://www.rawpixel.com/image/6024735/photo-image-background-public-domain-trees"],
  ["A foggy forest trail", "https://www.rawpixel.com/image/3294718/free-photo-image-abies-cc0-cloudy"],
  ["Mountain lake at dawn", "https://www.rawpixel.com/image/3285402/free-photo-image-alps-austria-bridge"],
];

function ProjectArtwork({ id }: { id: string }) {
  if (id === "fpo-link") {
    return (
      <div className="project-artwork artwork-fpo" aria-hidden="true">
        <span className="art-index">FIELD SYSTEMS / 01</span>
        <svg className="field-lines" viewBox="0 0 640 420" fill="none" aria-hidden="true">
          <path d="M-20 110 150 48l120 70 118-44 170 65 110-34M-30 184l194-58 122 71 132-48 128 66 125-38M-20 272l188-62 128 72 132-53 149 71 88-23M-40 350l192-53 145 77 137-52 143 62 100-28" />
          <path d="m185 12 38 84-42 70 43 86-34 89 50 94m114-398-31 82 43 78-27 82 54 89m107-324-25 75 43 86-34 67 46 88" />
          <circle cx="320" cy="210" r="9" />
        </svg>
        <div className="art-paper">
          <span className="art-kicker">FPO / MARKET NETWORK</span>
          <strong>Closer from<br />harvest to market.</strong>
          <span className="art-route"><i /> HARVEST <i /> MATCH <i /> MARKET</span>
        </div>
        <span className="art-disclaimer">Concept artwork · not a product screenshot</span>
      </div>
    );
  }

  return (
    <div className="project-artwork artwork-portfolio" aria-hidden="true">
      <span className="art-index">PORTFOLIOIQ / 02</span>
      <div className="portfolio-board">
        <div className="portfolio-board-head"><span>PortfolioIQ</span><span>LOCAL / ANALYSIS</span></div>
        <p>Signals, with context.</p>
        <svg viewBox="0 0 620 240" fill="none" aria-hidden="true">
          <path className="chart-grid" d="M0 40h620M0 100h620M0 160h620M0 220h620" />
          <path className="chart-line" d="M0 188c49-8 51-61 103-49s63 54 111 20 64-42 112-20 57-11 104-53 64 16 103-2 52-39 87-62" />
        </svg>
        <div className="portfolio-board-foot"><span>Research workflow</span><span>Dry-run by default</span></div>
      </div>
      <span className="art-disclaimer">Illustrative only · no live or performance data</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="hero-story" aria-labelledby="hero-title">
        <header className="site-shell topbar">
          <Link className="brand" href="/" aria-label="4LPH7 home"><span>4LPH7</span><span className="brand-dot">.ME</span></Link>
          <MobileNav />
          <div className="nav-actions"><SoundToggle /><CommandPalette /></div>
        </header>
        <div className="hero-stage">
          <Image className="hero-image" src="/images/fog-lake-jpg.webp" alt="" aria-hidden="true" fill priority sizes="100vw" />
          <div className="hero-scrim" />
          <CursorRingField />
          <div className="site-shell hero-content">
            <div className="hero-title-block">
              <p className="hero-location"><svg className="material-location-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg> {profile.location}</p>
              <h1 id="hero-title">ARUL G<br /><span>Engineer</span></h1>
            </div>
            <div className="hero-action-block">
              <p>{profile.headline} {profile.intro}</p>
              <div className="hero-actions">
                <a className="button-primary" href="#work">Explore my work <ArrowDownRight size={18} /></a>
                <Link className="button-secondary" href="/resume/">Résumé <ArrowUpRight size={16} /></Link>
              </div>
            </div>
          </div>
          <p className="hero-caption">Atmosphere only · not project media</p>
          <a className="hero-scroll" href="#about" aria-label="Scroll to profile">Scroll to explore <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <main id="main" className="site-shell">
        <section className="section about-section" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <h2 id="about-title">Curious.<br />Careful.</h2>
            <p className="section-intro">Based in {profile.location}. I work across secure software, data, and tools made for real-world constraints.</p>
          </div>
          <div className="about-layout">
            <figure className="about-image holo-media">
              <Image src="/images/fog-woodland-jpg.webp" alt="Trees fading into a misty landscape" fill sizes="(max-width: 700px) 100vw, 48vw" />
              <figcaption>Open landscape · not a product image</figcaption>
            </figure>
            <div className="about-copy">
              <p className="about-lead">{profile.intro}</p>
              <div className="about-facts">
                <div><h3>Tools I use</h3><p>{profile.skills.join(" · ")}</p></div>
                <div><h3>Education</h3><p>{profile.education}</p></div>
                <div><h3>Areas of interest</h3><p>Application security, cryptographic tooling, and practical software projects.</p></div>
              </div>
              <div className="terminal-block">
                <h3>Explore the local demo</h3>
                <p>This terminal accepts portfolio commands only. It cannot access a shell or your device.</p>
                <Terminal />
              </div>
            </div>
          </div>
          <div className="profile-links">
            <h3>Find me elsewhere</h3>
            {links.filter((link) => !("placeholder" in link && link.placeholder)).map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={16} /></a>)}
          </div>
        </section>

        <section className="section work-section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <h2 id="work-title">Selected work.</h2>
            <p className="section-intro">Project summaries are tied to their public repositories. Repository claims are documented by their authors, not independently audited here.</p>
          </div>
          <div className="project-list">
            {projects.filter((project) => project.featured).map((project) => (
              <article className="project" key={project.id}>
                <a className="project-image holo-media" href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.title} source repository`}>
                  <ProjectArtwork id={project.id} />
                  <span className="image-arrow" aria-hidden="true"><ArrowUpRight size={22} /></span>
                </a>
                <div className="project-copy">
                  <p className="project-category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className="project-summary">{project.summary}</p>
                  <p className="project-tags">{project.tags.join(" · ")}</p>
                  <details className="project-details">
                    <summary>Read implementation and limitations</summary>
                    <div className="details-body">
                      <p><strong>Problem:</strong> {project.problem}</p>
                      <ul>{project.implementation.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                      {project.claims.length > 0 && <><p><strong>Repository-documented claims:</strong></p><ul>{project.claims.map((claim) => <li key={claim.text}>{claim.text} {claim.evidence.map((evidence) => <a className="claim-source" key={evidence.sourceUrl} href={evidence.sourceUrl} target="_blank" rel="noreferrer">Source ↗</a>)}</li>)}</ul></>}
                      <p><strong>Known limits:</strong></p><ul>{project.limitations.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                    </div>
                  </details>
                  <div className="project-source">
                    {project.repoUrl && <a className="text-link" href={project.repoUrl} target="_blank" rel="noreferrer">Open source repository <ArrowUpRight size={16} /></a>}
                    {project.repoEvidence && <p>Repository checked {project.repoEvidence.lastVerified}. Features are described by the project README.</p>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section research-section" id="research" aria-labelledby="research-title">
          <div className="section-heading">
            <h2 id="research-title">Notes from the lab.</h2>
            <p className="section-intro">Research and technical writing, when there is something useful to share.</p>
          </div>
          {research.length > 0 ? (
            <div className="research-list">
              {research.map((item) => <article className="research-item" key={item.title}><div><h3>{item.title}</h3><p>{item.summary}</p></div><a className="text-link" href={item.evidence.sourceUrl} target="_blank" rel="noreferrer">Read source <ArrowUpRight size={16} /></a></article>)}
            </div>
          ) : <p className="empty-research">I’m editing the first public notes. No research claims or placeholder metrics are published here yet.</p>}
        </section>

        <section className="section resume-section-home" aria-labelledby="resume-title">
          <div>
            <h2 id="resume-title">Résumé.<br />Verified.</h2>
            <p>Education dates and public project details only. The content lives in an editable data file.</p>
          </div>
          <Link className="button-primary" href="/resume/">View résumé <ArrowUpRight size={18} /></Link>
        </section>
      </main>

      <section className="contact-image" aria-labelledby="contact-title">
        <Image src="/images/fog-trail-jpg.webp" alt="" aria-hidden="true" fill sizes="100vw" />
        <div className="contact-scrim" />
        <div className="site-shell contact-content">
          <div>
            <p className="contact-location">{profile.location}</p>
            <h2 id="contact-title">Have a good<br />problem?</h2>
            <p>Start a conversation or explore the code behind the work.</p>
          </div>
          <a className="button-primary" href="https://github.com/4LPH7" target="_blank" rel="noreferrer">Start with GitHub <ArrowUpRight size={18} /></a>
        </div>
      </section>

      <footer className="site-shell footer" id="contact">
        <Link className="footer-name" href="/" aria-label="Back to top">4LPH7</Link>
        <div className="footer-grid">
          <div className="footer-links"><span className="inspiration">Interaction references: <a href="https://www.originkit.dev/" target="_blank" rel="noreferrer">OriginKit</a>, <a href="https://metalforge.xyz/" target="_blank" rel="noreferrer">MetalForge</a>, <a href="https://uiverse.io/" target="_blank" rel="noreferrer">Uiverse</a>, and <a href="https://reactbits.dev/" target="_blank" rel="noreferrer">React Bits</a>. Icons: <a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer">Google Material Symbols</a> and Lucide.</span>{links.filter((link) => !("placeholder" in link && link.placeholder)).map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15} /></a>)}<Link href="/resume/">Résumé <ArrowUpRight size={15} /></Link></div>
          <details className="image-credits">
            <summary>Image credits</summary>
            <p>CC0 photographs from Rawpixel via Openverse. <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">CC0 license ↗</a>. They are atmospheric landscapes, not depictions of ARUL G or the featured software.</p>
            {imageCredits.map(([name, href]) => <a key={name} href={href} target="_blank" rel="noreferrer">{name} ↗</a>)}
          </details>
        </div>
        <div className="footer-meta"><span>© {new Date().getFullYear()} ARUL G</span><span>4LPH7.ME</span><a href="#hero-title">Back to top ↑</a></div>
      </footer>
    </>
  );
}
