import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cinema name is required"],
      unique: true,
      trim: true,
    },

    bundleSizes: {
      type: [Number],
      required: [true, "Bundle sizes are required"],
      validate: [
        {
          validator: (sizes) => sizes.length >= 1 && sizes.length <= 10,
          message: "Bundle sizes must contain 1 to 10 values",
        },
        {
          validator: (sizes) =>
            sizes.every(
              (size) => Number.isInteger(size) && size >= 1 && size <= 500,
            ),
          message: "Each bundle size must be an integer between 1 and 500",
        },
        {
          validator: (sizes) => new Set(sizes).size === sizes.length,
          message: "Bundle sizes must be unique",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

const Cinema = mongoose.model("Cinema", cinemaSchema);

export default Cinema;
