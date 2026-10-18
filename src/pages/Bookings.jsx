import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib_api";
import { formatBooking } from "../lib_format";
export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = () => {
    setLoading(true);
    api
      .bookings()
      .then((r) => setBookings((r.bookings || []).map(formatBooking)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  const cancel = async (id) => {
    try {
      await api.updateBookingStatus(id, "Cancelled");
      load();
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <div className="container-wide py-12">
      <p className="font-bold text-blue-600">Customer area</p>
      <h1 className="mt-2 text-4xl font-black">My bookings</h1>
      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      {loading ? (
        <p className="mt-8 text-slate-500">Loading bookings...</p>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex gap-4">
                  <span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-2xl">
                    {b.providerAvatar}
                  </span>
                  <div>
                    <h2 className="font-black">{b.serviceName}</h2>
                    <p className="text-sm text-slate-500">
                      {b.providerName} · {b.dateLabel}
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      {b.total.toLocaleString()} MMK
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {b.status}
                  </span>
                  {!["Cancelled", "Completed", "Rejected"].includes(
                    b.status,
                  ) && (
                    <button
                      onClick={() => cancel(b.id)}
                      className="text-sm font-bold text-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {!bookings.length && (
            <div className="py-20 text-center">
              <p>No bookings yet.</p>
              <Link
                to="/services"
                className="mt-3 inline-block font-bold text-blue-600"
              >
                Find a service →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
