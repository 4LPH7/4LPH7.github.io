import assert from "node:assert/strict";
import { test } from "node:test";
import { SOUTH_INDIA, WORLD } from "../data/worldMap.ts";
import { HOME, cellOf, kind, land } from "./geo.ts";

const isLand = (lon: number, lat: number) => {
  const p = cellOf(WORLD, lon, lat);
  return p ? land(WORLD, p.c, p.r) : false;
};
const southKind = (lon: number, lat: number) => {
  const p = cellOf(SOUTH_INDIA, lon, lat);
  return p ? kind(SOUTH_INDIA, p.c, p.r) : -1;
};

test("the world grid knows land from sea", () => {
  assert.equal(isLand(13, 23), true, "Sahara");
  assert.equal(isLand(-100, 40), true, "USA");
  assert.equal(isLand(134, -25), true, "Australia");
  assert.equal(isLand(-150, 0), false, "Pacific");
  assert.equal(isLand(-30, 30), false, "Atlantic");
  assert.equal(isLand(HOME.lon, HOME.lat), true, "Coimbatore");
});

test("the South India grid marks Tamil Nadu", () => {
  assert.equal(southKind(HOME.lon, HOME.lat), 2, "Coimbatore is in Tamil Nadu");
  assert.equal(southKind(80.2, 13.05), 2, "Chennai");
  assert.equal(southKind(78.1, 9.9), 2, "Madurai");
  assert.equal(southKind(77.59, 12.97), 1, "Bengaluru is land but not Tamil Nadu");
  assert.equal(southKind(76.3, 9.9), 1, "Kochi is Kerala");
  assert.equal(southKind(70, 15), 0, "Arabian Sea");
  assert.equal(southKind(80.7, 7.5), 1, "Sri Lanka");
});

test("cells outside a grid are null", () => {
  assert.equal(cellOf(SOUTH_INDIA, 0, 0), null);
  assert.equal(cellOf(WORLD, 0, -80), null);
});
