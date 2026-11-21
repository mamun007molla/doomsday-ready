import express from "express";

import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
} from "../controllers/movieController.js";

const router = express.Router();

router.post("/", createMovie);

router.get("/", getAllMovies);

router.get("/:id", getMovieById);

router.patch("/:id", updateMovie);

export default router;
