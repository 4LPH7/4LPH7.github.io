import assert from "node:assert/strict";
import { test } from "node:test";
import { site } from "../data/site.ts";
import { menuItems, menuSocials } from "./menu.ts";

test("menu items are numbered 00..06 in nav order, so they match the section labels", () => {
  const items = menuItems(site.nav);
  assert.deepEqual(items.map((i) => i.number), ["00", "01", "02", "03", "04", "05", "06"]);
  assert.deepEqual(items.map((i) => i.label), ["Home", "About", "Projects", "Education", "Skills", "Stats", "Contact"]);
});

test("menu items keep the in-page anchor href", () => {
  assert.equal(menuItems(site.nav)[2].href, "#projects");
});

test("socials without a URL are left out so no dead links render", () => {
  const socials = menuSocials([{ label: "GitHub", href: "https://github.com/4LPH7" }, { label: "LinkedIn" }]);
  assert.deepEqual(socials, [{ label: "GitHub", href: "https://github.com/4LPH7" }]);
});

test("site data exposes only socials with a confirmed URL", () => {
  assert.deepEqual(menuSocials(site.socials).map((s) => s.label), ["GitHub", "LinkedIn"]);
});
