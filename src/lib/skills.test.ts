import assert from "node:assert/strict";
import { test } from "node:test";
import { site } from "../data/site.ts";
import { TABS, filterSkills, tabCounts } from "./skills.ts";

test("tabs are All, Frontend, Backend, Tools in that order", () => {
  assert.deepEqual(TABS, ["All", "Frontend", "Backend", "Tools"]);
});

test("All returns every skill; other tabs filter by category", () => {
  assert.equal(filterSkills(site.skills, "All").length, 17);
  assert.deepEqual(filterSkills(site.skills, "Tools").map((s) => s.name), ["Git", "Docker", "Vercel", "GitHub Actions"]);
  assert.ok(filterSkills(site.skills, "Backend").every((s) => s.category === "Backend"));
});

test("counts match the reference layout: All 17, Frontend 8, Backend 5, Tools 4", () => {
  assert.deepEqual(tabCounts(site.skills), { All: 17, Frontend: 8, Backend: 5, Tools: 4 });
});
