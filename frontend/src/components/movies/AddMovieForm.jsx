import { useState } from "react";
import api from "../../services/api";

function AddMovieForm({ onMovieAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    releaseYear: "",
    runtime: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await api("/movies", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          releaseYear: Number(formData.releaseYear),
          runtime: Number(formData.runtime),
          prerequisites: [],
          watched: false,
        }),
      });

      onMovieAdded(result.data);

      setFormData({
        title: "",
        releaseYear: "",
        runtime: "",
      });

      setSuccess("Movie added successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold">Add New Movie</h2>

      <input
        type="text"
        name="title"
        placeholder="Movie Title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white"
      />

      <input
        type="number"
        name="releaseYear"
        placeholder="Release Year"
        value={formData.releaseYear}
        onChange={handleChange}
        min="1"
        required
        className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white"
      />

      <input
        type="number"
        name="runtime"
        placeholder="Runtime (1-300 minutes)"
        value={formData.runtime}
        onChange={handleChange}
        min="1"
        max="300"
        required
        className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3 text-white"
      />

      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-green-400">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-5 py-3 rounded-lg font-medium"
      >
        {loading ? "Adding..." : "Add Movie"}
      </button>
    </form>
  );
}

export default AddMovieForm;
