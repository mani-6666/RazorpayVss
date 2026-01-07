import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainings } from "../api/api";

export default function Trainings() {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTrainings()
      .then(setTrainings)
      .catch(() => setError("Unable to load trainings"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg">
        Loading trainings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">
        Available Trainings
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {trainings.map(t => (
          <div
            key={t.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold mb-3">{t.title}</h2>

              <p className="text-gray-600 mb-6">
                Industry-ready hands-on training with real projects.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">
                ₹{(t.price_amount / 100).toLocaleString("en-IN")}
              </span>

              <button
                onClick={() => navigate(`/checkout/${t.id}`)}
                className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
