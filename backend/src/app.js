import express from "express";
import cors from "cors";
import errorMiddleware from "./middleware/errorMiddleware.js";
import movieRoutes from "./routes/movieRoutes.js";
import cinemaRoutes from "./routes/cinemaRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/movies", movieRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use(errorMiddleware);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Doomsday Ready API is running!",
  });
});

export default app;
