import { useState } from "react";
import api from "../../services/api";

function AddCinemaForm({ onCinemaAdded }) {
  const [name, setName] = useState("");
  const [bundleSizes, setBundleSizes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const sizes = bundleSizes.split(",").map((size) => Number(size.trim()));

    if (
      sizes.some((size) => !Number.isInteger(size) || size < 1 || size > 500)
    ) {
      setError("Bundle sizes must be integers between 1 and 500.");
      return;
    }

    if (sizes.length < 1 || sizes.length > 10) {
      setError("Enter between 1 and 10 bundle sizes.");
      return;
    }

    if (new Set(sizes).size !== sizes.length) {
      setError("Bundle sizes must be unique.");
      return;
    }

    setLoading(true);

    try {
      const result = await api("/cinemas", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          bundleSizes: sizes,
        }),
      });

      onCinemaAdded(result.data);
      setName("");
      setBundleSizes("");
      setSuccess("Cinema added successfully!");
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
      <h2 className="text-xl font-semibold">Add New Cinema</h2>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Cinema Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Star Cineplex"
          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">
          Bundle Sizes
        </label>
        <input
          value={bundleSizes}
          onChange={(e) => setBundleSizes(e.target.value)}
          required
          placeholder="e.g. 1, 3, 4"
          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white"
        />
        <p className="text-xs text-slate-400 mt-2">
          Enter 1–10 unique bundle sizes, separated by commas.
        </p>
      </div>

      {error && <p className="text-red-400">{error}</p>}
      {success && <p className="text-green-400">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
      >
        {loading ? "Adding..." : "Add Cinema"}
      </button>
    </form>
  );
}

export default AddCinemaForm;
