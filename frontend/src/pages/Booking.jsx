import { useEffect, useState } from "react";
import api from "../services/api";
import AddCinemaForm from "../components/cinemas/AddCinemaForm";

function Booking() {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [bookingResult, setBookingResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        const result = await api("/cinemas");
        setCinemas(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  const handleCinemaAdded = (newCinema) => {
    setCinemas((prev) => [...prev, newCinema]);
  };

  const handleCalculateBooking = async (e) => {
    e.preventDefault();
    setError("");
    setBookingResult(null);

    if (!selectedCinema) {
      setError("Please select a cinema.");
      return;
    }

    const size = Number(groupSize);

    if (!Number.isInteger(size) || size < 1 || size > 10000) {
      setError("Group size must be between 1 and 10,000.");
      return;
    }

    setBookingLoading(true);

    try {
      const result = await api(
        `/cinemas/${selectedCinema}/booking?groupSize=${size}`,
      );

      setBookingResult(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cinema Booking</h1>
        <p className="text-slate-400 mt-2">
          Manage cinemas and calculate ticket bundle requirements.
        </p>
      </div>

      <div className="mb-8">
        <AddCinemaForm onCinemaAdded={handleCinemaAdded} />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-5">Calculate Booking</h2>

        <form onSubmit={handleCalculateBooking} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Select Cinema
            </label>

            <select
              value={selectedCinema}
              onChange={(e) => setSelectedCinema(e.target.value)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white"
            >
              <option value="">Choose a cinema</option>

              {cinemas.map((cinema) => (
                <option key={cinema._id} value={cinema._id}>
                  {cinema.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Group Size
            </label>

            <input
              type="number"
              min="1"
              max="10000"
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              placeholder="e.g. 6"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={bookingLoading}
            className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
          >
            {bookingLoading ? "Calculating..." : "Calculate Booking"}
          </button>
        </form>

        {error && <p className="text-red-400 mt-4">{error}</p>}

        {bookingResult && (
          <div className="mt-6 bg-slate-900 rounded-xl p-5">
            {bookingResult.possible ? (
              <>
                <h3 className="text-lg font-semibold text-green-400">
                  Exact Booking Possible!
                </h3>

                <p className="text-slate-300 mt-3">
                  Minimum Bundles: <strong>{bookingResult.minBundles}</strong>
                </p>

                <h4 className="font-semibold mt-5 mb-3">Bundle Breakdown</h4>

                <div className="space-y-2">
                  {Object.entries(bookingResult.bundleCounts || {}).map(
                    ([bundleSize, quantity]) => (
                      <div
                        key={bundleSize}
                        className="flex justify-between bg-slate-800 rounded-lg p-3"
                      >
                        <span>Bundle of {bundleSize}</span>
                        <span>Quantity: {quantity}</span>
                      </div>
                    ),
                  )}
                </div>
              </>
            ) : (
              <h3 className="text-lg font-semibold text-red-400">
                Exact Booking Not Possible
              </h3>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Cinemas</h2>

        {loading && <p className="text-slate-400">Loading cinemas...</p>}

        {!loading && cinemas.length === 0 && (
          <p className="text-slate-400">No cinemas found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {cinemas.map((cinema) => (
            <div
              key={cinema._id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5"
            >
              <h3 className="text-lg font-semibold">{cinema.name}</h3>

              <p className="text-slate-400 mt-3 text-sm">Bundle Sizes</p>

              <div className="flex flex-wrap gap-2 mt-2">
                {cinema.bundleSizes.map((size) => (
                  <span
                    key={size}
                    className="bg-slate-900 text-blue-300 px-3 py-1 rounded-lg"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Booking;
