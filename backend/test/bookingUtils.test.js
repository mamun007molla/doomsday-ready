import { test } from "node:test";
import assert from "node:assert/strict";

import { calculateBooking } from "../src/utils/bookingUtils.js";

// Example 1: Bundle sizes [1, 3, 4], group size 6
test("should find minimum bundles for group size 6", () => {
  const result = calculateBooking([1, 3, 4], 6);

  assert.deepEqual(result, {
    possible: true,
    minBundles: 2,
    bundleCounts: { 3: 2 },
  });
});

// Example 2: Bundle sizes [2, 5], group size 11
test("should find minimum bundles for group size 11", () => {
  const result = calculateBooking([2, 5], 11);

  assert.deepEqual(result, {
    possible: true,
    minBundles: 4,
    bundleCounts: { 2: 3, 5: 1 },
  });
});

// Example 3: Bundle sizes [6, 9, 20], group size 44
test("should find minimum bundles for group size 44", () => {
  const result = calculateBooking([6, 9, 20], 44);

  assert.deepEqual(result, {
    possible: true,
    minBundles: 4,
    bundleCounts: { 6: 1, 9: 2, 20: 1 },
  });
});

// Example 4: Bundle sizes [4, 6], group size 7
test("should return impossible when exact booking is unavailable", () => {
  const result = calculateBooking([4, 6], 7);

  assert.deepEqual(result, {
    possible: false,
    minBundles: null,
    bundleCounts: {},
  });
});
