import { test } from "node:test";
import assert from "node:assert/strict";

import { wouldCreateCycle } from "../src/utils/graphUtils.js";

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
