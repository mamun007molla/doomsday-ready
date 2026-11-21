import { useEffect, useState } from "react";
import api from "../services/api";

function RewatchPlan() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Watched Movies</p>
              <p className="text-2xl font-bold mt-1">{plan.watchedCount}</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-400 text-sm">Unwatched Runtime</p>
              <p className="text-2xl font-bold mt-1">
                {plan.totalUnwatchedRuntime} min
              </p>
            </div>
          </div>

          {plan.rewatchOrder?.length > 0 ? (
            <ol className="space-y-3">
              {plan.rewatchOrder.map((movie, index) => (
                <li
                  key={movie._id}
                  className="bg-slate-900 rounded-lg p-4 flex items-center gap-4"
                >
                  <span className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {index + 1}
                  </span>

                  <div>
                    <p className="font-semibold">{movie.title}</p>
                    <p className="text-sm text-slate-400">
                      {movie.releaseYear} · {movie.runtime} minutes
                    </p>
                  </div>
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
