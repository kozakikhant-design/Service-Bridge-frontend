
import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import { api } from "../lib_api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [s, p, services] = await Promise.all([
        api.adminStats(),
        api.pendingProviders(),
        api.pendingServices(),
      ]);

      setStats(s.stats);
      setPending(p.providers || []);
      setPendingServices(services.services || []);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const verify = async (id, verified) => {
    try {
      await api.verifyProvider(id, verified);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const reviewService = async (id, status) => {
    let rejectionReason = "";

    if (status === "rejected") {
      rejectionReason = window.prompt(
        "Enter the reason for rejecting this service:"
      ) || "";

      if (!rejectionReason.trim()) {
        return;
      }
    }

    try {
      await api.reviewService(id, status, rejectionReason);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <div className="container-wide py-12">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-wide py-12">
      <p className="font-bold text-blue-600">Administration</p>
      <h1 className="mt-2 text-4xl font-black">
        Platform overview
      </h1>

      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="👥"
          label="Users"
          value={stats?.users ?? "—"}
          detail="All users"
        />
        <StatCard
          icon="🧑‍🔧"
          label="Providers"
          value={stats?.providers ?? "—"}
          detail="Profiles"
        />
        <StatCard
          icon="📅"
          label="Bookings"
          value={stats?.bookings ?? "—"}
          detail="All bookings"
        />
        <StatCard
          icon="💰"
          label="Revenue"
          value={stats ? stats.revenue.toLocaleString() : "—"}
          detail="MMK"
        />
      </div>

      {/* Provider verification */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-black">Provider verification</h2>
          <span className="text-sm text-slate-500">
            {pending.length} pending
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {pending.map((p) => (
            <div
              key={p._id}
              className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">{p.user?.name}</p>
                <p className="text-sm text-slate-500">
                  {p.category?.name} · {p.location}
                </p>
                <p className="text-xs text-slate-400">
                  {p.user?.email}
                </p>
              </div>

              <button
                onClick={() => verify(p._id, true)}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white"
              >
                Verify provider
              </button>
            </div>
          ))}

          {!pending.length && (
            <p className="py-8 text-sm text-slate-500">
              No providers are waiting for verification.
            </p>
          )}
        </div>
      </section>

      {/* Service approval */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-black">Service approval</h2>
          <span className="text-sm text-slate-500">
            {pendingServices.length} awaiting review
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {pendingServices.map((s) => (
            <div
              key={s._id}
              className="rounded-xl bg-slate-50 p-4"
            >
              <h3 className="font-bold">{s.name}</h3>

              <p className="mt-1 text-sm text-slate-600">
                Provider: {s.provider?.user?.name || "Unknown"}
              </p>

              <p className="text-sm text-slate-600">
                Category: {s.provider?.category?.name || "Unknown"}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Price: {Number(s.price).toLocaleString()} MMK per {s.unit}
              </p>

              {s.description && (
                <p className="mt-2 text-sm text-slate-500">
                  {s.description}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => reviewService(s._id, "approved")}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white"
                >
                  Approve
                </button>

                <button
                  onClick={() => reviewService(s._id, "rejected")}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}

          {!pendingServices.length && (
            <p className="py-8 text-sm text-slate-500">
              No services are waiting for review.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
