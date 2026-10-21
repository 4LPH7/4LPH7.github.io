import type { Skill, SkillCategory } from "../data/site.ts";

export const TABS = ["All", "Frontend", "Backend", "Tools"] as const;
export type Tab = (typeof TABS)[number];

export const filterSkills = (skills: Skill[], tab: Tab) => (tab === "All" ? skills : skills.filter((s) => s.category === tab));

export const tabCounts = (skills: Skill[]) =>
  Object.fromEntries(TABS.map((t) => [t, filterSkills(skills, t).length])) as Record<Tab, number>;

export type { SkillCategory };
