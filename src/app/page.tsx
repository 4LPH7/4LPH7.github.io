import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { CommandPalette, CursorRingField, MobileNav, SoundToggle, Terminal } from "@/components/Interactive";
import { links, profile, projects, research } from "@/data/portfolio";

const imageCredits = [
  ["Fog across a quiet lake", "https://www.rawpixel.com/image/5907336/photo-image-public-domain-nature-water"],
  ["Trees in a misty landscape", "https://www.rawpixel.com/image/6024735/photo-image-background-public-domain-trees"],
  ["A foggy forest trail", "https://www.rawpixel.com/image/3294718/free-photo-image-abies-cc0-cloudy"],
  ["Mountain lake at dawn", "https://www.rawpixel.com/image/3285402/free-photo-image-alps-austria-bridge"],
];

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
              <p className="hero-location"><MapPin size={16} /> {profile.location}</p>
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
              <Image src="/images/fog-woodland-jpg.webp" alt="Quiet stone walls and trees fading into mist" fill sizes="(max-width: 700px) 100vw, 48vw" />
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
                  <Image src={project.image} alt="" fill sizes="(max-width: 700px) 100vw, 54vw" />
                  <span className="image-note">Ambient landscape · not a product screenshot</span>
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
          <div className="footer-links"><span className="inspiration">Interaction inspiration: <a href="https://www.originkit.dev/" target="_blank" rel="noreferrer">OriginKit</a> and <a href="https://metalforge.xyz/" target="_blank" rel="noreferrer">MetalForge</a>.</span>{links.filter((link) => !("placeholder" in link && link.placeholder)).map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15} /></a>)}<Link href="/resume/">Résumé <ArrowUpRight size={15} /></Link></div>
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
