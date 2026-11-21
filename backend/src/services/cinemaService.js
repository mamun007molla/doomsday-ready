import Cinema from "../models/Cinema.js";
import { calculateBooking } from "../utils/bookingUtils.js";

// Create Cinema
export const createCinema = async (cinemaData) => {
  const cinema = await Cinema.create(cinemaData);
  return cinema;
};

// Get All Cinemas
export const getAllCinemas = async () => {
  return await Cinema.find().sort({ name: 1 });
};

// Get Booking Information
export const getCinemaBooking = async (cinemaId, groupSize) => {
  const cinema = await Cinema.findById(cinemaId);

  if (!cinema) {
    return null;
  }

  const booking = calculateBooking(cinema.bundleSizes, groupSize);

  return {
    cinema: {
      id: cinema._id,
      name: cinema.name,
      bundleSizes: cinema.bundleSizes,
    },
    groupSize,
    ...booking,
  };
};
