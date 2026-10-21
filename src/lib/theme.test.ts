import assert from "node:assert/strict";
import { test } from "node:test";
import vm from "node:vm";
import { THEME_KEY, resolveTheme, themeInitScript } from "./theme.ts";

function runInit(getItem: () => string | null) {
  const documentElement = { dataset: {} as Record<string, string> };
  vm.runInNewContext(themeInitScript, {
    document: { documentElement },
    localStorage: { getItem },
  });
  return documentElement.dataset.theme;
}

test("defaults to dark when nothing is stored", () => {
  assert.equal(resolveTheme(null), "dark");
  assert.equal(resolveTheme(undefined), "dark");
});

test("returns light only for the stored value 'light'", () => {
  assert.equal(resolveTheme("light"), "light");
  assert.equal(resolveTheme("dark"), "dark");
  assert.equal(resolveTheme("purple"), "dark");
});

test("init script applies a stored light theme before paint", () => {
  assert.equal(runInit(() => "light"), "light");
});

test("init script leaves dark default when storage is empty", () => {
  assert.equal(runInit(() => null), undefined);
});

test("init script survives blocked storage", () => {
  assert.equal(runInit(() => { throw new Error("blocked"); }), undefined);
});

test("storage key keeps the existing value so saved choices carry over", () => {
  assert.equal(THEME_KEY, "portfolio-theme");
});
