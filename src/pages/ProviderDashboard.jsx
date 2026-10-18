import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "../lib_api";
import { formatBooking } from "../lib_format";
import StatCard from "../components/StatCard";
export default function ProviderDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    category: "",
    location: "",
    description: "",
    experience: "",
    isAvailable: true,
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const load = () =>
    Promise.all([
      api.myProvider().catch((e) => e),
      api.bookings(),
      api.categories(),
    ]).then(([p, b, c]) => {
      if (p?.provider) {
        setProfile(p.provider);
        setForm({
          category: p.provider.category?._id || "",
          location: p.provider.location || "",
          description: p.provider.description || "",
          experience: p.provider.experience || "",
          isAvailable: p.provider.isAvailable,
        });
      }
      setBookings((b.bookings || []).map(formatBooking));
      setCategories(c.categories || []);
    });
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);
  const create = async (e) => {
    e.preventDefault();
    try {
      const r = await api.createProvider(form);
      setProfile(r.provider);
      setNotice("Provider profile created.");
    } catch (e) {
      setError(e.message);
    }
  };
  const update = async (e) => {
    e.preventDefault();
    try {
      const r = await api.updateProvider(profile._id, form);
      setProfile(r.provider);
      setNotice("Provider profile updated.");
    } catch (e) {
      setError(e.message);
    }
  };
  const save = profile ? update : create;
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const completed = bookings.filter((b) => b.status === "Completed").length;
  const earnings = bookings
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + b.total, 0);
  return (
    <div className="container-wide py-12">
      <p className="font-bold text-blue-600">Provider dashboard</p>
      <h1 className="mt-2 text-3xl font-black">
        Welcome, {user.name.split(" ")[0]}.
      </h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="📅"
          label="Pending bookings"
          value={pending}
          detail="Needs attention"
        />
        <StatCard
          icon="✓"
          label="Completed"
          value={completed}
          detail="All time"
        />
        <StatCard
          icon="💰"
          label="Earnings"
          value={earnings.toLocaleString()}
          detail="MMK"
        />
        <StatCard
          icon="⭐"
          label="Rating"
          value={profile?.rating ? profile.rating.toFixed(1) : "New"}
          detail={
            profile?.reviewCount
              ? `${profile.reviewCount} reviews`
              : "No reviews yet"
          }
        />
      </div>
      {error && (
        <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-black">
            {profile ? "Provider profile" : "Set up your provider profile"}
          </h2>
          <form onSubmit={save} className="mt-5 space-y-4">
            <label className="block text-sm font-bold">
              Category
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
              >
                <option value="">Choose a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-bold">
              Location
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </label>
            <label className="block text-sm font-bold">
              Experience
              <input
                value={form.experience}
                onChange={(e) =>
                  setForm({ ...form, experience: e.target.value })
                }
                placeholder="e.g. 5 years"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </label>
            <label className="block text-sm font-bold">
              Description
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows="4"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-bold">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) =>
                  setForm({ ...form, isAvailable: e.target.checked })
                }
              />{" "}
              Currently accepting bookings
            </label>
            <button className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">
              {profile ? "Save profile" : "Create profile"}
            </button>
            {notice && (
              <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                {notice}
              </p>
            )}
          </form>
        </section>
        <aside className="space-y-5">
          <Link
            to="/provider/services"
            className="block rounded-2xl border border-slate-200 bg-white p-6 hover:border-blue-300"
          >
            <span className="text-3xl">🛠️</span>
            <h2 className="mt-4 text-xl font-black">Manage services</h2>
            <p className="mt-2 text-sm text-slate-500">
              Create, edit and remove your real services and prices.
            </p>
          </Link>
          <section className="rounded-2xl bg-slate-900 p-6 text-white">
            <h2 className="font-black">Recent bookings</h2>
            <div className="mt-4 space-y-3">
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className="rounded-xl bg-white/10 p-3">
                  <p className="font-bold">{b.serviceName}</p>
                  <p className="text-xs text-slate-300">
                    {b.providerName} · {b.dateLabel} · {b.status}
                  </p>
                </div>
              ))}
              {!bookings.length && (
                <p className="text-sm text-slate-300">No bookings yet.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
