import { useState } from "react";
import EditPrerequisites from "./EditPrerequisites";

function MovieCard({ movie, movies, onToggleWatched, onUpdatePrerequisites }) {
  const [isEditing, setIsEditing] = useState(false);

  const prerequisiteTitles = (movie.prerequisites || [])
    .map((item) => {
      if (typeof item === "object") return item.title;

      return movies.find((m) => m._id === item)?.title;
    })
    .filter(Boolean);

  const handleSave = async (movieId, selectedIds) => {
    await onUpdatePrerequisites(movieId, selectedIds);
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <h2 className="text-xl font-semibold">{movie.title}</h2>

      <div className="text-slate-400 mt-3 space-y-2">
        <p>Release Year: {movie.releaseYear}</p>
        <p>Runtime: {movie.runtime} minutes</p>
        <p>Status: {movie.watched ? "Watched" : "Not Watched"}</p>
        <p>
          Prerequisites:{" "}
          {prerequisiteTitles.length > 0
            ? prerequisiteTitles.join(", ")
            : "None"}
        </p>
      </div>

      <button
        onClick={() => onToggleWatched(movie)}
        className="mt-4 mr-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
      >
        Mark as {movie.watched ? "Not Watched" : "Watched"}
      </button>

      <button
        onClick={() => setIsEditing((prev) => !prev)}
        className="mt-4 px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white"
      >
        {isEditing ? "Close Editor" : "Edit Prerequisites"}
      </button>

      {isEditing && (
        <EditPrerequisites
          movie={movie}
          movies={movies}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

export default MovieCard;
