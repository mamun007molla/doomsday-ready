import * as movieService from "../services/movieService.js";

export const createMovie = async (req, res, next) => {
  try {
    const movie = await movieService.createMovie(req.body);

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMovies = async (req, res, next) => {
  try {
    const movies = await movieService.getAllMovies();

    res.status(200).json({
      success: true,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const movie = await movieService.getMovieById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const movie = await movieService.updateMovie(req.params.id, req.body);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

export const getMovieRewatchOrder = async (req, res, next) => {
  try {
    const result = await movieService.getMovieRewatchOrder(req.params.id);

    if (result === null) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const watchedCount = result.filter((movie) => movie.watched).length;

    const totalUnwatchedRuntime = result
      .filter((movie) => !movie.watched)
      .reduce((total, movie) => total + movie.runtime, 0);

    res.status(200).json({
      success: true,
      data: {
        rewatchOrder: result,
        watchedCount,
        totalUnwatchedRuntime,
      },
    });
  } catch (error) {
    next(error);
  }
};
