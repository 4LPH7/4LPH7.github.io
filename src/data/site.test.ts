import assert from "node:assert/strict";
import { test } from "node:test";
import { site } from "./site.ts";

test("nav lists every page section in order", () => {
  assert.deepEqual(site.nav.map((n) => n.id), ["home", "about", "projects", "education", "skills", "stats", "contact"]);
});

test("every nav link points at a section id", () => {
  for (const n of site.nav) assert.equal(n.href, `#${n.id}`);
});

test("education has three stages ending in the B.E. degree", () => {
  assert.equal(site.education.length, 3);
  assert.match(site.education[2].title, /B\.E\./);
});

test("skills use only the reference categories", () => {
  for (const s of site.skills) assert.ok(["Frontend", "Backend", "Tools"].includes(s.category), s.name);
});

test("private details are never published (checked by shape, so no real values live in this file)", () => {
  const dump = JSON.stringify(site);
  assert.ok(!/\b\d{10}\b/.test(dump), "10-digit phone number");
  assert.ok(!/\b\d{1,2}[-/.]\d{1,2}[-/.]\d{4}\b/.test(dump), "date of birth");
  assert.ok(!/\b\d{6}\b/.test(dump), "6-digit postal code");
  assert.ok(!/\b\d{7,}\b/.test(dump), "roll or ID number");
  assert.ok(!/\b(roll no|dob|date of birth|father|mother|aadhaar|pan card)\b/i.test(dump), "private field label");
});

test("unconfirmed content is explicitly flagged", () => {
  assert.ok(site.todo.length > 0);
});

test("off-the-keyboard cards have real copy, not TODO placeholders", () => {
  assert.equal(site.about.offKeyboard.length, 4);
  for (const c of site.about.offKeyboard) assert.ok(c.detail.length > 20 && !/todo/i.test(c.detail), c.title);
});

test("projects have unique ids, tags and a summary; repo links are https GitHub URLs", () => {
  assert.equal(new Set(site.projects.map((p) => p.id)).size, site.projects.length);
  for (const p of site.projects) {
    assert.ok(p.summary.length > 20 && p.tags.length > 0, p.id);
    if (p.repoUrl) assert.match(p.repoUrl, /^https:\/\/github\.com\/4LPH7\//);
  }
});

test("education shows the supplied marks: X 78%, XII 68%, B.E. CGPA 7.3", () => {
  assert.deepEqual(site.education.map((e) => e.score), ["78%", "68%", "CGPA 7.3"]);
});

test("both school stages name the same government school", () => {
  assert.match(site.education[0].organization, /V\.?\s?C\.?\s?V/i);
  assert.equal(site.education[0].organization, site.education[1].organization);
});

test("at least five projects link to a real 4LPH7 repository", () => {
  assert.ok(site.projects.filter((p) => p.repoUrl).length >= 5);
});

test("OmniRoute is not listed in selected work", () => {
  assert.ok(!site.projects.some((p) => /omniroute/i.test(p.id + p.title)));
});

test("skills: 17 unique items split 8 Frontend / 5 Backend / 4 Tools", () => {
  assert.equal(site.skills.length, 17);
  assert.equal(new Set(site.skills.map((s) => s.name)).size, 17);
  const n = (c: string) => site.skills.filter((s) => s.category === c).length;
  assert.deepEqual([n("Frontend"), n("Backend"), n("Tools")], [8, 5, 4]);
});

test("stats: hireable, a real repo count, a latest-push note and three flip cards", () => {
  assert.equal(site.stats.hireable, "Yes");
  assert.ok(Number.isInteger(site.stats.repos) && site.stats.repos > 0);
  assert.ok(site.stats.latestPush.length > 10);
  assert.deepEqual(site.stats.cards.map((c) => c.id), ["runtime", "hardware", "location"]);
  for (const c of site.stats.cards) assert.ok(c.rows.length >= 3, c.id);
});

test("player has at least one track, each with a unique /music source", () => {
  assert.ok(site.tracks.length >= 1);
  assert.equal(new Set(site.tracks.map((t) => t.src)).size, site.tracks.length);
  for (const t of site.tracks) assert.match(t.src, /^\/music\/[\w-]+\.mp3$/);
});
