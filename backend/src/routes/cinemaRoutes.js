import express from "express";

import {
  createCinema,
  getAllCinemas,
  getCinemaBooking,
} from "../controllers/cinemaController.js";

const router = express.Router();

router.post("/", createCinema);

router.get("/", getAllCinemas);

router.get("/:id/booking", getCinemaBooking);

export default router;
