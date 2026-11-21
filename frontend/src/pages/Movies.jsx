import { useEffect, useState } from "react";
import api from "../services/api";
import AddMovieForm from "../components/movies/AddMovieForm";
import MovieCard from "../components/movies/MovieCard";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const result = await api("/movies");
        setMovies(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieAdded = (newMovie) => {
    setMovies((prev) => [...prev, newMovie]);
  };

  const handleToggleWatched = async (movie) => {
    try {
      const result = await api(`/movies/${movie._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          watched: !movie.watched,
        }),
      });

      setMovies((prev) =>
        prev.map((item) => (item._id === movie._id ? result.data : item)),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Movies</h1>
        <p className="text-slate-400 mt-2">Manage your movie collection.</p>
      </div>

      <div className="mb-8">
        <AddMovieForm onMovieAdded={handleMovieAdded} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onToggleWatched={handleToggleWatched}
          />
        ))}
      </div>

      {movies.length === 0 && (
        <p className="text-slate-400">No movies found.</p>
      )}
    </div>
  );
}

export default Movies;
