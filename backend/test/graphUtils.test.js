import { test } from "node:test";
import assert from "node:assert/strict";
import { wouldCreateCycle, getRewatchOrder } from "../src/utils/graphUtils.js";

// Test 1: Valid dependency
test("should allow valid dependencies", () => {
  const graph = new Map([
    ["avengers", ["iron-man"]],
    ["iron-man", []],
  ]);

  const result = wouldCreateCycle("endgame", ["avengers"], graph);

  assert.equal(result, false);
});

// Test 2: Direct circular dependency
test("should detect direct circular dependency", () => {
  const graph = new Map([["iron-man", []]]);

  const result = wouldCreateCycle("iron-man", ["iron-man"], graph);

  assert.equal(result, true);
});

// Test 3: Indirect circular dependency
test("should detect indirect circular dependency", () => {
  const graph = new Map([
    ["avengers", ["iron-man"]],
    ["iron-man", []],
  ]);

  const result = wouldCreateCycle("iron-man", ["avengers"], graph);

  assert.equal(result, true);
});

// Test 4: Get correct rewatch order
test("should return prerequisites in correct order", () => {
  const graph = new Map([
    ["iron-man", []],
    ["avengers", ["iron-man"]],
    ["age-of-ultron", ["avengers"]],
    ["endgame", ["age-of-ultron"]],
  ]);

  const result = getRewatchOrder("endgame", graph);

  assert.deepEqual(result, ["iron-man", "avengers", "age-of-ultron"]);
});

// Test 5: Should include shared prerequisites only once
test("should include each prerequisite only once", () => {
  const graph = new Map([
    ["iron-man", []],
    ["avengers", ["iron-man"]],
    ["thor", ["iron-man"]],
    ["endgame", ["avengers", "thor"]],
  ]);

  const result = getRewatchOrder("endgame", graph);

  assert.deepEqual(result, ["iron-man", "avengers", "thor"]);
});
