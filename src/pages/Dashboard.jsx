import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "../lib_api";
import { formatBooking } from "../lib_format";
import StatCard from "../components/StatCard";
export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState(0);
  useEffect(() => {
    Promise.all([api.bookings(), api.favorites()])
      .then(([b, f]) => {
        setBookings((b.bookings || []).map(formatBooking));
        setFavorites((f.favorites || []).length);
      })
      .catch(() => {});
  }, []);
  const upcoming = bookings.filter(
    (b) => !["Cancelled", "Completed", "Rejected"].includes(b.status),
  );
  const spent = bookings
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + b.total, 0);
  return (
    <div className="container-wide py-12">
      <div>
        <p className="text-sm font-bold text-blue-600">Customer dashboard</p>
        <h1 className="mt-2 text-3xl font-black">
          Good to see you, {user.name.split(" ")[0]}.
        </h1>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="📅"
          label="Upcoming bookings"
          value={upcoming.length}
          detail="Active"
        />
        <StatCard
          icon="❤️"
          label="Saved providers"
          value={favorites}
          detail="All time"
        />
        <StatCard
          icon="✓"
          label="Completed"
          value={bookings.filter((b) => b.status === "Completed").length}
          detail="Bookings"
        />
        <StatCard
          icon="💰"
          label="Spent"
          value={spent.toLocaleString()}
          detail="MMK"
        />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Recent bookings</h2>
            <Link to="/bookings" className="text-sm font-bold text-blue-600">
              View all
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-4 rounded-xl bg-slate-50 p-4"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-white text-xl">
                  {b.providerAvatar}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{b.serviceName}</p>
                  <p className="text-xs text-slate-500">
                    {b.providerName} · {b.dateLabel}
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {b.status}
                </span>
              </div>
            ))}
            {!bookings.length && (
              <p className="py-8 text-sm text-slate-500">No bookings yet.</p>
            )}
          </div>
        </section>
        <aside className="rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-blue-300">Need something?</p>
          <h2 className="mt-2 text-2xl font-black">
            Find a professional today.
          </h2>
          <Link
            to="/services"
            className="mt-6 inline-block rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900"
          >
            Browse services
          </Link>
        </aside>
      </div>
    </div>
  );
}
