import express from "express";

import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  getMovieRewatchOrder,
} from "../controllers/movieController.js";

const router = express.Router();

router.post("/", createMovie);

router.get("/", getAllMovies);

router.get("/:id", getMovieById);

router.patch("/:id", updateMovie);

router.get("/:id/rewatch-order", getMovieRewatchOrder);

export default router;
