import { useState } from "react";

function EditPrerequisites({ movie, movies, onSave, onCancel }) {
  const [selectedIds, setSelectedIds] = useState(
    (movie.prerequisites || []).map((id) =>
      typeof id === "object" ? id._id : id,
    ),
  );

  const handleChange = (movieId) => {
    setSelectedIds((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(movie._id, selectedIds);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <h3 className="font-semibold">Edit Prerequisites</h3>

      {movies
        .filter((item) => item._id !== movie._id)
        .map((item) => (
          <label
            key={item._id}
            className="flex items-center gap-3 text-slate-300"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(item._id)}
              onChange={() => handleChange(item._id)}
              className="h-4 w-4"
            />
            {item.title}
          </label>
        ))}

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Prerequisites
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditPrerequisites;
