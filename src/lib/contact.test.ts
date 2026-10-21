import assert from "node:assert/strict";
import { test } from "node:test";
import { buildMailto, resolveTarget, validate } from "./contact.ts";

test("buildMailto encodes subject and body and keeps the sender details", () => {
  const url = buildMailto("me@x.in", { name: "A & B", email: "a@b.co", message: "Hi there\nSecond line" });
  assert.ok(url.startsWith("mailto:me@x.in?subject="));
  const q = new URL(url.replace("mailto:", "http://x/")).searchParams;
  assert.equal(q.get("subject"), "Portfolio message from A & B");
  assert.equal(q.get("body"), "Hi there\nSecond line\n\nFrom: A & B\nEmail: a@b.co");
});

test("web3forms key wins and is sent as access_key", () => {
  assert.deepEqual(resolveTarget({ web3formsKey: "k1", endpoint: "https://e.x/post" }), { url: "https://api.web3forms.com/submit", fields: { access_key: "k1" } });
});

test("a custom endpoint is used when there is no web3forms key", () => {
  assert.deepEqual(resolveTarget({ endpoint: "https://e.x/post" }), { url: "https://e.x/post", fields: {} });
});

test("with nothing configured the target is null (mailto fallback)", () => {
  assert.equal(resolveTarget({}), null);
  assert.equal(resolveTarget({ web3formsKey: "  ", endpoint: "" }), null);
});

test("validate flags empty fields and bad emails", () => {
  assert.deepEqual(validate({ name: " ", email: "nope", message: "" }), { name: "Enter your name.", email: "Enter a valid email address.", message: "Write a short message." });
  assert.deepEqual(validate({ name: "Ann", email: "ann@x.io", message: "Hello" }), {});
});
