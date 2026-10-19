import type { Metadata } from "next";
import Link from "next/link";
import { profile, projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Résumé",
  description: "A concise résumé for ARUL G / 4LPH7.",
  alternates: { canonical: "/resume/" },
};

export default function ResumePage() {
  return (
    <main id="main" className="site-shell resume-page">
      <Link className="brand" href="/">← <span>4LPH7</span> / HOME</Link>
      <h1>{profile.name}<br /><span style={{ color: "var(--accent)" }}>Software Engineer</span></h1>
      <p className="hero-copy">{profile.headline}</p>
      <section className="resume-section"><h2>Profile</h2><p>{profile.intro}</p><p>{profile.location} · {profile.education}</p></section>
      <section className="resume-section"><h2>Selected projects</h2>{projects.map((project) => <div key={project.id} style={{ marginBottom: 24 }}><h3>{project.title}</h3><p>{project.summary}</p>{project.repoUrl && <p><a className="text-link" href={project.repoUrl} target="_blank" rel="noreferrer">Repository ↗</a></p>}</div>)}</section>
      <section className="resume-section"><h2>Skills</h2><p>{profile.skills.join(" · ")}</p></section>
      <section className="resume-section"><h2>Links</h2><p><a className="text-link" href={profile.github} target="_blank" rel="noreferrer">GitHub profile ↗</a></p></section>
      <Link className="button-secondary" href="/">← Back to portfolio</Link>
    </main>
  );
}
