import Movie from "../models/Movie.js";
import { wouldCreateCycle, getRewatchOrder } from "../utils/graphUtils.js";

export const createMovie = async (movieData) => {
  const movie = await Movie.create(movieData);
  return movie;
};

export const getAllMovies = async () => {
  const movies = await Movie.find().sort({ releaseYear: 1 });
  return movies;
};

export const getMovieById = async (movieId) => {
  const movie = await Movie.findById(movieId);
  return movie;
};

export const updateMovie = async (movieId, updateData) => {
  if (updateData.prerequisites !== undefined) {
    const movies = await Movie.find().select("_id prerequisites").lean();

    const graph = new Map(
      movies.map((movie) => [
        movie._id.toString(),
        movie.prerequisites.map((id) => id.toString()),
      ]),
    );

    const hasCycle = wouldCreateCycle(
      movieId,
      updateData.prerequisites.map(String),
      graph,
    );

    if (hasCycle) {
      const error = new Error("Circular dependency detected");

      error.statusCode = 409;
      error.code = "CIRCULAR_DEPENDENCY";

      throw error;
    }
  }

  const movie = await Movie.findByIdAndUpdate(movieId, updateData, {
    new: true,
    runValidators: true,
  });

  return movie;
};

// Get rewatch order for a movie
export const getMovieRewatchOrder = async (movieId) => {
  const movies = await Movie.find()
    .select("_id title releaseYear runtime watched prerequisites")
    .lean();

  // Check whether target movie exists
  const targetMovie = movies.find((movie) => movie._id.toString() === movieId);

  if (!targetMovie) {
    return null;
  }

  // Build dependency graph
  const graph = new Map(
    movies.map((movie) => [
      movie._id.toString(),
      movie.prerequisites.map((id) => id.toString()),
    ]),
  );

  // Get prerequisite IDs in correct order
  const orderedIds = getRewatchOrder(movieId, graph);

  // Convert IDs into movie objects
  const movieMap = new Map(
    movies.map((movie) => [movie._id.toString(), movie]),
  );

  return orderedIds.map((id) => movieMap.get(id));
};
