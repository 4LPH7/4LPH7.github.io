export interface Evidence {
  sourceUrl: string;
  sourceType: "repository" | "demo" | "report" | "publication";
  lastVerified: string;
}

export interface ProjectClaim {
  text: string;
  evidence: Evidence[];
}

export interface Project {
  id: string;
  image: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  implementation: string[];
  limitations: string[];
  tags: string[];
  repoUrl?: string;
  repoEvidence?: Evidence;
  claims: ProjectClaim[];
  status: "source-documented" | "details-pending";
  featured: boolean;
}

export const profile = {
  name: "ARUL G",
  handle: "4LPH7",
  location: "Coimbatore, India",
  education: "Graduated 2022–2026",
  headline: "Software engineer focused on secure, practical software.",
  intro: "I explore application security, cryptographic tooling, and data-led projects.",
  github: "https://github.com/4LPH7",
  site: "https://4lph7.me",
  skills: [
    "Python",
    "C++",
    "Flask",
    "Cryptography",
    "Data science",
    "Docker",
    "Linux",
    "Git",
  ],
};

export const projects: Project[] = [
  {
    id: "fpo-link",
    image: "/images/fog-trail-jpg.webp",
    title: "FPOLink TN",
    category: "Agricultural technology · Tamil Nadu",
    summary:
      "An open-source operating system for Tamil Nadu FPOs that brings together market-price intelligence, harvest aggregation, demand matching, forecasting, and farmer communications.",
    problem:
      "FPOs and administrators need a shared view of market prices, available harvests, buyers, and operational work.",
    implementation: [
      "The repository documents a dashboard and API backed by PostgreSQL and a background worker, with tenant-scoped roles.",
      "It describes market-price ingestion with source mapping, data provenance, freshness indicators, and explainable quality scoring.",
      "Documented workflows include harvest aggregation, buyer matching, operational tasks, and price forecasting.",
      "The README identifies Telegram as the active default messaging channel and WhatsApp as dormant until credentials are configured.",
    ],
    limitations: [
      "Feature and deployment status comes from repository documentation; it is not an independent production or impact evaluation.",
      "WhatsApp is documented as disabled by default and requires external Meta credentials.",
    ],
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Forecasting", "FPO operations"],
    repoUrl: "https://github.com/4LPH7/FPOLink",
    repoEvidence: {
      sourceUrl: "https://github.com/4LPH7/FPOLink",
      sourceType: "repository",
      lastVerified: "2026-10-19",
    },
    claims: [
      {
        text: "The repository describes FPOLink as a Tamil Nadu FPO platform for price intelligence, harvest aggregation, forecasting, and farmer communications.",
        evidence: [{ sourceUrl: "https://github.com/4LPH7/FPOLink", sourceType: "repository", lastVerified: "2026-10-19" }],
      },
      {
        text: "The README documents market-price ingestion, provenance and quality scoring, and multi-tenant FPO workflows.",
        evidence: [{ sourceUrl: "https://github.com/4LPH7/FPOLink", sourceType: "repository", lastVerified: "2026-10-19" }],
      },
    ],
    status: "source-documented",
    featured: true,
  },
  {
    id: "portfolioiq",
    image: "/images/mountain-lake-jpg.webp",
    title: "PortfolioIQ",
    category: "Self-hosted portfolio analytics · Indian equities",
    summary:
      "A self-hosted portfolio analysis and rebalancing tool for Indian equities, with quantitative signals, tax-aware workflows, and execution safety controls.",
    problem:
      "Individual investors need portfolio and risk analysis while keeping broker credentials and account data on their own hardware.",
    implementation: [
      "The repository documents a local Flask API, PostgreSQL database, dashboard, and scheduled market-data polling.",
      "It describes Zerodha Kite integration for quotes and holdings, with dry-run mode enabled by default.",
      "The README outlines walk-forward signal evaluation, evidence-gated rebalancing suggestions, and tax-lot tracking.",
      "Trade proposals and execution checks are documented as part of an append-only audit trail.",
    ],
    limitations: [
      "Feature and safety descriptions come from repository documentation; they are not an independent audit or profitability assessment.",
      "The README frames the application for portfolio analysis and paper trading and notes that quantitative signals do not guarantee future performance.",
    ],
    tags: ["Python", "Flask", "PostgreSQL", "Quant research", "Risk controls"],
    repoUrl: "https://github.com/4LPH7/PortfolioIQ",
    repoEvidence: {
      sourceUrl: "https://github.com/4LPH7/PortfolioIQ",
      sourceType: "repository",
      lastVerified: "2026-10-19",
    },
    claims: [
      {
        text: "The repository describes a self-hosted portfolio intelligence and rebalancing application for Indian equities.",
        evidence: [{ sourceUrl: "https://github.com/4LPH7/PortfolioIQ", sourceType: "repository", lastVerified: "2026-10-19" }],
      },
      {
        text: "The README documents a dry-run default and quantitative evidence gates for order recommendations.",
        evidence: [{ sourceUrl: "https://github.com/4LPH7/PortfolioIQ", sourceType: "repository", lastVerified: "2026-10-19" }],
      },
    ],
    status: "source-documented",
    featured: true,
  },
];

export const research: {
  title: string;
  summary: string;
  status: string;
  evidence: Evidence;
}[] = [];

export const links = [{ label: "GitHub", href: profile.github }];
