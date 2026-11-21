import * as cinemaService from "../services/cinemaService.js";

// Create Cinema
export const createCinema = async (req, res, next) => {
  try {
    const cinema = await cinemaService.createCinema(req.body);

    res.status(201).json({
      success: true,
      message: "Cinema created successfully",
      data: cinema,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Cinemas
export const getAllCinemas = async (req, res, next) => {
  try {
    const cinemas = await cinemaService.getAllCinemas();

    res.status(200).json({
      success: true,
      data: cinemas,
    });
  } catch (error) {
    next(error);
  }
};

// Get Cinema Booking
export const getCinemaBooking = async (req, res, next) => {
  try {
    const { groupSize } = req.query;

    const parsedGroupSize = Number(groupSize);

    if (
      !Number.isInteger(parsedGroupSize) ||
      parsedGroupSize < 1 ||
      parsedGroupSize > 10000
    ) {
      return res.status(400).json({
        success: false,
        message: "Group size must be an integer between 1 and 10000",
      });
    }

    const booking = await cinemaService.getCinemaBooking(
      req.params.id,
      parsedGroupSize,
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
