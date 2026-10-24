// Content for the 4LPH7.me portfolio. Edit here; every `todo` entry needs Arul's input.
// Never add DOB, phone, street address, family or ID numbers.

export interface NavItem { id: string; label: string; href: string }
interface Chapter { number: string; title: string; detail: string }
interface SiteProject { id: string; title: string; summary: string; tags: string[]; repoUrl?: string }
/** A heading split into a plain part and a muted italic part. */
export interface Heading { label: string; plain: string; italic: string }
/** `year` is the completion year (shown large); `period` is the full span shown under it. */
interface Stage { year: string; icon: "school" | "grad"; stage: string; label: string; title: string; organization: string; location: string; period: string; score: string; detail: string }
export type SkillCategory = "Frontend" | "Backend" | "Tools";
export interface Skill { name: string; category: SkillCategory }
interface FlipCard { id: string; title: string; hint: string; rows: [string, string][] }
/** `cover`: album art shown on the record label and lock screens (a served path, e.g. /music/one-day.webp; ~320px is plenty). */
export interface Track { title: string; artist: string; src: string; cover?: string }
export interface Social { label: string; href?: string }

const sections = ["Home", "About", "Projects", "Education", "Skills", "Stats", "Contact"];

export const site = {
  name: "Arul G",
  handle: "4LPH7",
  email: "arulartad@gmail.com",
  location: "Coimbatore, IN",
  timeZone: "Asia/Kolkata",
  availability: "Available",
  nav: sections.map((label): NavItem => ({ id: label.toLowerCase(), label, href: `#${label.toLowerCase()}` })),
  socials: [
    { label: "GitHub", href: "https://github.com/4LPH7" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/4lph7/" },
  ] as Social[],
  hero: {
    tagline: "Full-stack developer exploring data, AI and fintech.",
    lead: "Full-stack developer,",
    leadItalic: "building for real people.",
    prompt: "arul@4lph7:~$",
    terminal: ["Loading profile: Arul G", "Stack: Next.js · Python · FastAPI", "Ready. Scroll to explore."],
    badge: "FULL STACK • DEVELOPER • ",
  },
  headings: {
    about: { label: "ABOUT", plain: "The person behind", italic: "the commits." },
    projects: { label: "SELECTED WORK", plain: "Things", italic: "I've built." },
    education: { label: "MY JOURNEY", plain: "Learning,", italic: "in stages." },
    skills: { label: "MY TOOLS", plain: "The", italic: "toolbox." },
    stats: { label: "BY THE NUMBERS", plain: "Stats", italic: "& quirks." },
    contact: { label: "CONTACT", plain: "Let's build", italic: "something." },
  } satisfies Record<string, Heading>,
  footer: {
    chip: "DEVELOPER",
    plain: "Practical software,",
    italic: "built to be trusted.",
    blurb: "I like useful tools, clear data and code that keeps people's money and identity safe.",
  },
  about: {
    story: "I build impactful software that solves real-world problems, including self-hosted analytics for Indian equities. I turn complex data into clear, actionable insights, with a strong focus on security, transparency, and practical value.",
    chapters: [
      { number: "01", title: "Purpose-driven building", detail: "Every project starts with a real problem. I focus on creating tools that fit practical needs and help people make better decisions." },
      { number: "02", title: "Clarity over complexity", detail: "I turn raw data into understandable insights, keeping information traceable, results transparent, and limitations clear." },
      { number: "03", title: "Security at the core", detail: "I build with privacy, security, and responsible data handling in mind, using sensible defaults to protect what matters most." },
    ] as Chapter[],
    offKeyboard: [
      { number: "01", title: "Linux & tinkering", detail: "Running Garuda Linux on a dual-boot laptop, experimenting with custom ROMs, and rarely having fewer than a dozen terminals open." },
      { number: "02", title: "Gaming & hosting", detail: "Hosting a dedicated Palworld server and bringing PC and console players together for shared adventures." },
      { number: "03", title: "Mind & memory", detail: "Practising mental-math speed techniques and exploring mentalism for the fun of surprising people." },
      { number: "04", title: "Security & experimentation", detail: "Exploring SIEM systems, intrusion detection, and blockchain through hands-on projects, including a Python-based medical records system." },
    ] as Chapter[],
  },
  projects: [
    { id: "portfolioiq", title: "PortfolioIQ", summary: "Self-hosted portfolio intelligence for Indian equities: tax-aware rebalancing and algorithmic signals on your own hardware, with Zerodha credentials and holdings kept private.", tags: ["Python", "Kite Connect", "Fintech"], repoUrl: "https://github.com/4LPH7/PortfolioIQ" },
    { id: "fpolink", title: "FPOLink TN", summary: "Self-hostable operating system for Tamil Nadu farmer producer organisations: mandi price intelligence, harvest aggregation, demand forecasting and Telegram/WhatsApp farmer alerts, starting with turmeric and banana in Erode.", tags: ["FastAPI", "Next.js", "Agritech"], repoUrl: "https://github.com/4LPH7/FPOLink" },
    { id: "absolute-vote", title: "Absolute Vote", summary: "Blockchain voting system with smart contracts, a Flask backend and MetaMask signing: admin-run sessions, one vote per wallet, and results shown as a donut chart.", tags: ["Python", "Blockchain", "Flask"], repoUrl: "https://github.com/4LPH7/Absolute_Vote" },
    { id: "secure-share", title: "Secure Share", summary: "Encrypted file sharing with Fernet-encrypted storage, bcrypt logins, and share links that can carry a password, an expiry date and a download limit.", tags: ["Python", "Security", "Encryption"], repoUrl: "https://github.com/4LPH7/Secure_Share" },
    { id: "face-detector", title: "Face Detector", summary: "Real-time face recognition and people counting on video streams with OpenCV, plus a Tkinter app to register faces, log attendance and export it to CSV.", tags: ["Python", "OpenCV", "Computer vision"], repoUrl: "https://github.com/4LPH7/Face_detector" },
    { id: "autoincome", title: "AutoIncome", summary: "Zero-cost, AI-agent automation system that earns legitimate online income with approval gates and minimal human intervention.", tags: ["AI agents", "Automation", "In progress"] },
    { id: "portfolio", title: "4LPH7.me", summary: "This interactive portfolio: Next.js static export with GSAP, Lenis and React Three Fiber.", tags: ["Next.js", "GSAP", "Three.js"], repoUrl: "https://github.com/4LPH7/4LPH7.me" },
    { id: "greenstack", title: "Greenstack", summary: "Aeroponic vertical tower-farming product concept for Indian households.", tags: ["Hardware", "Agritech", "In progress"] },
  ] as SiteProject[],
  education: [
    { year: "2020", icon: "school", stage: "STAGE 01", label: "FOUNDATION", title: "Secondary Education (SSLC)", organization: "Thiru V.C.V. Government Higher Secondary School", location: "Vellakinar, Tamil Nadu", period: "Class of 2020", score: "78%", detail: "Built fundamentals and early curiosity about technology." },
    { year: "2022", icon: "school", stage: "STAGE 02", label: "EXPLORATION", title: "Higher Secondary (HSC)", organization: "Thiru V.C.V. Government Higher Secondary School", location: "Vellakinar, Tamil Nadu", period: "2020 — 2022", score: "68%", detail: "Studied Computer Science and Mathematics alongside Physics and Chemistry." },
    { year: "2026", icon: "grad", stage: "STAGE 03", label: "ENGINEERING", title: "B.E. Computer Science & Engineering (Data Science)", organization: "Annamalai University", location: "Tamil Nadu", period: "2022 — 2026", score: "CGPA 7.3", detail: "Full-stack development, data science and AI integration." },
  ] as Stage[],
  stats: {
    intro: "A few numbers, a few quirks and what plays while I code.",
    hireable: "Yes",
    hireableNote: "Open to remote roles",
    repos: 34, // public repos on github.com/4LPH7, checked 2026-10-21; update by hand
    latestPush: "Building this interactive portfolio with Next.js, GSAP and Three.js.",
    latestRepo: "4LPH7.me",
    cards: [
      { id: "runtime", title: "Run time", hint: "Flip for the runtime", rows: [
        ["OS", "Garuda Linux + Windows, dual-boot"],
        ["Background Tasks", "Palworld server, side projects"],
        ["Network Status", "Available"],
      ] },
      { id: "hardware", title: "Hardware", hint: "Flip for the specs", rows: [
        ["Model", "ASUS Vivobook K5504VA"],
        ["Processor", "Intel Core i9-13900H"],
        ["Architecture", "13th Gen"],
        ["Graphics", "Intel Iris Xe"],
      ] },
      { id: "location", title: "Current location", hint: "Flip for the place", rows: [
        ["City", "Coimbatore"],
        ["Region", "Tamil Nadu, India"],
        ["Time zone", "IST (UTC+5:30)"],
      ] },
    ] as FlipCard[],
  },
  tracks: [
    // Mofjell's orchestral cover of Hans Zimmer's "One Day" (Pirates of the Caribbean: At World's End), 2024 single.
    { title: "One Day (Epic Version)", artist: "Mofjell", src: "/music/one-day.mp3", cover: "/music/one-day.webp" },
  ] as Track[],
  educationSpan: "2020 → 2026",
  skills: [
    { name: "React", category: "Frontend" }, { name: "Next.js", category: "Frontend" },
    { name: "TypeScript", category: "Frontend" }, { name: "Tailwind CSS", category: "Frontend" },
    { name: "GSAP", category: "Frontend" },
    { name: "HTML", category: "Frontend" }, { name: "CSS", category: "Frontend" }, { name: "JavaScript", category: "Frontend" },
    { name: "Three.js", category: "Frontend" }, { name: "Flutter", category: "Frontend" },
    { name: "Python", category: "Backend" }, { name: "Node.js", category: "Backend" },
    { name: "Supabase", category: "Backend" },
    { name: "Flask", category: "Backend" }, { name: "C++", category: "Backend" },
    { name: "FastAPI", category: "Backend" }, { name: "PostgreSQL", category: "Backend" },
    { name: "Solidity", category: "Backend" }, { name: "OpenCV", category: "Backend" },
    { name: "Git", category: "Tools" }, { name: "Docker", category: "Tools" },
    { name: "Vercel", category: "Tools" }, { name: "GitHub Actions", category: "Tools" },
    { name: "Linux", category: "Tools" },
  ] as Skill[],
  todo: [
    "Projects: add repo links for AutoIncome/Greenstack once the repos exist",
    "Projects: PortfolioIQ, FPOLink, Absolute Vote, Secure Share and Face Detector summaries were rewritten from each repo's README; check the wording",
    "Projects: FPOLink's 'turmeric and banana in Erode' detail is from the earlier copy, not the README text I could read; confirm it",
    "Skills: confirm list and levels",
    "Stats: refresh the repo count and latest-push line by hand; confirm the runtime/hardware rows",
    "Assets: photo, lanyard texture, web3forms key; more tracks in public/music/ (add to site.tracks with the real artist credit)",
  ],
};
