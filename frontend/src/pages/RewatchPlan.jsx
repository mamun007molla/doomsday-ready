import { useEffect, useState } from "react";
import api from "../services/api";

function RewatchPlan() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingMovieId, setUpdatingMovieId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const result = await api("/movies");
        setMovies(result.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMovies();
  }, []);

  const handleGeneratePlan = async () => {
    if (!selectedMovie) {
      setError("Please select a movie first.");
      return;
    }

    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const result = await api(`/movies/${selectedMovie}/rewatch-order`);
      setPlan(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWatched = async (movie) => {
    setError("");
    setUpdatingMovieId(movie._id);

    try {
      const result = await api(`/movies/${movie._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          watched: !movie.watched,
        }),
      });

      const updatedMovie = result.data;

      // Update the movie list
      setMovies((prev) =>
        prev.map((item) => (item._id === movie._id ? updatedMovie : item)),
      );

      // Update the current rewatch plan
      setPlan((prev) => ({
        ...prev,
        rewatchOrder: prev.rewatchOrder.map((item) =>
          item._id === movie._id ? updatedMovie : item,
        ),
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingMovieId("");
    }
  };

  // Calculate watched movies and remaining runtime
  const rewatchOrder = plan?.rewatchOrder || [];

  const watchedCount = rewatchOrder.filter((movie) => movie.watched).length;

  const totalMovies = rewatchOrder.length;

  const progressPercentage =
    totalMovies > 0 ? Math.round((watchedCount / totalMovies) * 100) : 0;

  const totalUnwatchedRuntime = rewatchOrder
    .filter((movie) => !movie.watched)
    .reduce((total, movie) => total + movie.runtime, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Rewatch Plan</h1>
        <p className="text-slate-400 mt-2">
          Generate the correct watching order for a movie.
        </p>
      </div>

      <div className="max-w-xl bg-slate-800 border border-slate-700 rounded-xl p-6">
        <label className="block text-sm text-slate-300 mb-2">
          Select a movie
        </label>

        <select
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white"
        >
          <option value="">Choose a movie</option>

          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>

        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="mt-4 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
        >
          {loading ? "Generating..." : "Generate Rewatch Plan"}
        </button>
      </div>

      {error && <p className="mt-5 text-red-400">{error}</p>}

      {plan && (
        <div className="mt-8 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-5">Your Rewatch Order</h2>

          {/* Progress Section */}
          <div className="mb-6 bg-slate-900 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <p className="text-slate-300">Watching Progress</p>

              <p className="font-semibold">
                {watchedCount} of {totalMovies} watched
              </p>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <p className="text-sm text-slate-400 mt-2">
              {progressPercentage}% completed
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Watched Movies</p>
              <p className="text-2xl font-bold mt-1">{watchedCount}</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Unwatched Runtime</p>
              <p className="text-2xl font-bold mt-1">
                {totalUnwatchedRuntime} min
              </p>
            </div>
          </div>

          {/* Rewatch List */}
          {rewatchOrder.length > 0 ? (
            <ol className="space-y-3">
              {rewatchOrder.map((movie, index) => (
                <li
                  key={movie._id}
                  className="bg-slate-900 rounded-lg p-4 flex items-center gap-4"
                >
                  <span className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold shrink-0">
                    {index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-semibold ${
                        movie.watched
                          ? "text-green-400 line-through"
                          : "text-white"
                      }`}
                    >
                      {movie.title}
                    </p>

                    <p className="text-sm text-slate-400">
                      {movie.releaseYear} · {movie.runtime} minutes
                    </p>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-300 shrink-0">
                    <input
                      type="checkbox"
                      checked={movie.watched}
                      disabled={updatingMovieId === movie._id}
                      onChange={() => handleToggleWatched(movie)}
                      className="w-5 h-5 accent-green-500 cursor-pointer"
                    />
                    Watched
                  </label>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-slate-400">
              No prerequisite movies found. You can watch this movie directly.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default RewatchPlan;
