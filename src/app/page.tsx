import Link from "next/link";
import { ArrowDown, ArrowUpRight, Github, MapPin } from "lucide-react";
import { CommandPalette, MobileNav, SoundToggle, Terminal } from "@/components/Interactive";
import { links, profile, projects, research } from "@/data/portfolio";

function MaterialTerminalIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 19H4V5h16v14ZM3 3c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H3Zm4.41 5.41L10 11l-2.59 2.59L8.83 15l4-4-4-4-1.42 1.41ZM14 15h4v-2h-4v2Z" /></svg>;
}

function ProjectPanel({ id, title, repoUrl }: { id: string; title: string; repoUrl?: string }) {
  const key = id === "fpo-link" ? "fpolink" : "portfolioiq";
  return (
    <div className={`project-panel project-panel-${key}`} aria-hidden="true">
      <div className="panel-top"><span className="panel-dot" /><span className="panel-dot" /><span className="panel-dot" /><span className="panel-title">{title}</span></div>
      <div className="panel-body">
        <span className="panel-prompt">~/projects/{key}</span>
        <strong>{key === "fpolink" ? "Field operations" : "Portfolio analysis"}</strong>
        <span className="panel-line">{key === "fpolink" ? "market data / harvest / matching" : "signals / risk / execution safeguards"}</span>
        <span className="panel-link">{repoUrl?.replace("https://github.com/", "github.com/")}</span>
      </div>
      <div className="panel-footer"><span>README documented</span><span>↗</span></div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <header className="site-shell topbar">
        <Link className="brand" href="/" aria-label="4LPH7 home">4LPH7<span>.ME</span></Link>
        <MobileNav />
        <nav className="desktop-nav" aria-label="Primary navigation"><a href="#about">About</a><a href="#work">Work</a><a href="#research">Research</a><Link href="/resume/">Résumé</Link></nav>
        <div className="nav-actions"><SoundToggle /><CommandPalette /></div>
      </header>

      <main id="main">
        <section className="hero site-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-location"><MapPin size={16} aria-hidden="true" /> {profile.location}</p>
            <h1 id="hero-title">ARUL G<span className="hero-period">.</span></h1>
            <p className="hero-role">{profile.headline}</p>
            <p className="hero-intro">{profile.intro}</p>
            <div className="hero-actions"><a className="button-primary" href="#work">View selected work <ArrowDown size={17} aria-hidden="true" /></a><Link className="button-secondary" href="/resume/">Résumé <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
          </div>
          <aside className="hero-console" aria-label="Portfolio summary">
            <div className="console-head"><span><MaterialTerminalIcon /> profile.ts</span><span>READ ONLY</span></div>
            <div className="console-code"><p><span className="code-muted">const</span> engineer = {'{'}</p><p> name: <span className="code-string">"{profile.name}"</span>,</p><p> focus: <span className="code-string">"secure software"</span>,</p><p> based: <span className="code-string">"{profile.location}"</span></p><p>{'}'};</p></div>
            <div className="console-foot"><span className="status-dot" /> Open to interesting problems</div>
          </aside>
          <a className="hero-scroll" href="#about"><span>Scroll to explore</span><ArrowDown size={15} aria-hidden="true" /></a>
        </section>

        <div className="site-shell">
          <section className="section about-section" id="about" aria-labelledby="about-title">
            <div className="section-heading"><div><p className="section-label">01 / PROFILE</p><h2 id="about-title">Build with care.<br />Stay curious.</h2></div><p className="section-intro">Based in {profile.location}. Exploring application security, cryptographic tooling, and data-led software.</p></div>
            <div className="about-grid">
              <div className="about-copy">
                <h3>How I work</h3>
                <p>{profile.intro}</p>
                <div className="fact-grid">
                  <div className="fact"><span>EDUCATION</span><strong>{profile.education}</strong></div>
                  <div className="fact"><span>TOOLKIT</span><strong>{profile.skills.join(" · ")}</strong></div>
                  <div className="fact"><span>INTERESTS</span><strong>Application security · Cryptography · Practical software</strong></div>
                </div>
                <div className="profile-links"><h3>Elsewhere</h3>{links.filter((link) => !("placeholder" in link && link.placeholder)).map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}</div>
              </div>
              <div className="terminal-block"><div className="terminal-heading"><h3><MaterialTerminalIcon /> Local demo terminal</h3><span>SAFE MODE</span></div><p>Try a portfolio command. This demo cannot access a shell or your device.</p><Terminal /></div>
            </div>
          </section>

          <section className="section work-section" id="work" aria-labelledby="work-title">
            <div className="section-heading"><div><p className="section-label">02 / REPOSITORIES</p><h2 id="work-title">Selected work.</h2></div><p className="section-intro">Summaries link to public repositories. Features and limitations are described by their authors, not independently audited here.</p></div>
            <div className="project-list">
              {projects.filter((project) => project.featured).map((project, index) => (
                <article className="project" key={project.id}>
                  <div className="project-visual"><ProjectPanel id={project.id} title={project.title} repoUrl={project.repoUrl} /><a className="visual-link" href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} source repository`}><Github size={18} aria-hidden="true" /> Source repository <ArrowUpRight size={16} aria-hidden="true" /></a></div>
                  <div className="project-copy">
                    <p className="section-label">0{index + 1} / {project.category}</p><h3>{project.title}</h3><p className="project-summary">{project.summary}</p><p className="project-tags">{project.tags.join(" · ")}</p>
                    <details className="project-details"><summary>Implementation and limitations</summary><div className="details-body"><p><strong>Problem:</strong> {project.problem}</p><ul>{project.implementation.map((detail) => <li key={detail}>{detail}</li>)}</ul>{project.claims.length > 0 && <><p><strong>Repository-documented claims:</strong></p><ul>{project.claims.map((claim) => <li key={claim.text}>{claim.text} {claim.evidence.map((evidence) => <a className="claim-source" key={evidence.sourceUrl} href={evidence.sourceUrl} target="_blank" rel="noreferrer">Evidence ↗</a>)}</li>)}</ul></>}<p><strong>Known limits:</strong></p><ul>{project.limitations.map((detail) => <li key={detail}>{detail}</li>)}</ul></div></details>
                    {project.repoEvidence && <p className="verified-note">Repository checked {project.repoEvidence.lastVerified}; features summarized from its README.</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section research-section" id="research" aria-labelledby="research-title">
            <div className="section-heading"><div><p className="section-label">03 / NOTES</p><h2 id="research-title">Research & notes.</h2></div><p className="section-intro">Technical writing and research, when there is something useful to share.</p></div>
            {research.length > 0 ? <div className="research-list">{research.map((item) => <article className="research-item" key={item.title}><div><h3>{item.title}</h3><p>{item.summary}</p></div><a className="text-link" href={item.evidence.sourceUrl} target="_blank" rel="noreferrer">Read source <ArrowUpRight size={16} aria-hidden="true" /></a></article>)}</div> : <p className="empty-research">The first public notes are in progress. No placeholder metrics or unsupported research claims are published here.</p>}
          </section>

          <section className="resume-callout"><div><p className="section-label">PROFILE / TEXT VERSION</p><h2>Résumé</h2><p>Education dates and public project details, maintained in an editable data file.</p></div><Link className="button-primary" href="/resume/">View résumé <ArrowUpRight size={17} aria-hidden="true" /></Link></section>

          <section className="contact-section" id="contact" aria-labelledby="contact-title"><div><p className="section-label">04 / CONTACT</p><h2 id="contact-title">Have a good problem?</h2><p>Start with the code, or reach out through GitHub.</p></div><a className="button-primary" href="https://github.com/4LPH7" target="_blank" rel="noreferrer">Open GitHub profile <ArrowUpRight size={17} aria-hidden="true" /></a></section>
        </div>
      </main>

      <footer className="site-shell footer">
        <div className="footer-top"><Link className="footer-brand" href="/">4LPH7<span>.ME</span></Link><p>Interfaces inspired by <a href="https://uiverse.io/" target="_blank" rel="noreferrer">Uiverse</a> and <a href="https://reactbits.dev/" target="_blank" rel="noreferrer">React Bits</a>. Icons: <a href="https://fonts.google.com/icons" target="_blank" rel="noreferrer">Google Material Symbols</a> and Lucide.</p></div>
        <div className="footer-links">{links.filter((link) => !("placeholder" in link && link.placeholder)).map((link) => <a key={link.label} href={link.href} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15} aria-hidden="true" /></a>)}<Link href="/resume/">Résumé <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
        <div className="footer-meta"><span>© {new Date().getFullYear()} ARUL G</span><span>4LPH7.ME · Static portfolio</span><a href="#hero-title">Back to top ↑</a></div>
      </footer>
    </>
  );
}
