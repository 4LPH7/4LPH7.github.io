import assert from "node:assert/strict";
import { test } from "node:test";
import { site } from "../data/site.ts";
import { TABS, filterSkills, tabCounts } from "./skills.ts";

test("tabs are All, Frontend, Backend, Tools in that order", () => {
  assert.deepEqual(TABS, ["All", "Frontend", "Backend", "Tools"]);
});

test("All returns every skill; other tabs filter by category", () => {
  assert.equal(filterSkills(site.skills, "All").length, 24);
  assert.deepEqual(filterSkills(site.skills, "Tools").map((s) => s.name), ["Git", "Docker", "Vercel", "GitHub Actions", "Linux"]);
  assert.ok(filterSkills(site.skills, "Backend").every((s) => s.category === "Backend"));
});

test("tab counts: All 24, Frontend 10, Backend 9, Tools 5", () => {
  assert.deepEqual(tabCounts(site.skills), { All: 24, Frontend: 10, Backend: 9, Tools: 5 });
});
