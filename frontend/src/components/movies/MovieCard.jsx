function MovieCard({ movie, onToggleWatched }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <h2 className="text-xl font-semibold">{movie.title}</h2>

      <div className="text-slate-400 mt-3 space-y-2">
        <p>Release Year: {movie.releaseYear}</p>
        <p>Runtime: {movie.runtime} minutes</p>
        <p>Status: {movie.watched ? "Watched" : "Not Watched"}</p>
      </div>

      <button
        onClick={() => onToggleWatched(movie)}
        className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        Mark as {movie.watched ? "Not Watched" : "Watched"}
      </button>
    </div>
  );
}

export default MovieCard;
