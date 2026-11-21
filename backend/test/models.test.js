import { test } from "node:test";
import assert from "node:assert/strict";

import Movie from "../src/models/Movie.js";
import Cinema from "../src/models/Cinema.js";

test("Movie should reject runtime above 300", () => {
  const movie = new Movie({
    title: "Test Movie",
    releaseYear: 2020,
    runtime: 301,
  });

  const error = movie.validateSync();

  assert.ok(error);
  assert.ok(error.errors.runtime);
});

test("Movie should accept valid data", () => {
  const movie = new Movie({
    title: "Test Movie",
    releaseYear: 2020,
    runtime: 120,
  });

  const error = movie.validateSync();

  assert.equal(error, undefined);
});

test("Cinema should reject bundle size above 500", () => {
  const cinema = new Cinema({
    name: "Test Cinema",
    bundleSizes: [600],
  });

  const error = cinema.validateSync();

  assert.ok(error);
  assert.ok(error.errors.bundleSizes);
});
