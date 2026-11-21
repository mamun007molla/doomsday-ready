import Movie from "../models/Movie.js";

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
  const movie = await Movie.findByIdAndUpdate(movieId, updateData, {
    new: true,
    runValidators: true,
  });

  return movie;
};
