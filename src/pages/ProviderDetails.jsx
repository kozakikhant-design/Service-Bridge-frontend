import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib_api";
import { formatProvider } from "../lib_format";
import { useAuth } from "../context/AuthContext";
export default function ProviderDetails(){
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => {
    Promise.all([api.provider(id), api.services({ provider: id })])
      .then(([p, s]) => {
        setProvider(formatProvider(p.provider));
        setServices(s.services || []);
        setSelected(s.services?.[0]?._id || "");
      })
      .catch((e) => setError(e.message));
  }, [id]);
  useEffect(() => {
    if (user?.role !== "customer") return;
    api
      .favorites()
      .then((r) =>
        setIsFavorite((r.favorites || []).some((f) => f.provider?._id === id)),
      )
      .catch(() => {});
  }, [user, id]);
  const service = useMemo(
    () => services.find((s) => s._id === selected),
    [services, selected],
  );
  const toggleFavorite = async () => {
    if (!user)
      return navigate("/login", { state: { from: `/providers/${id}` } });
    if (user.role !== "customer") return;
    try {
      if (isFavorite) {
        await api.removeFavorite(id);
        setIsFavorite(false);
      } else {
        await api.addFavorite(id);
        setIsFavorite(true);
      }
    } catch (e) {
      setNotice(e.message);
    }
  };
  const book = async (e) => {
    e.preventDefault();
    if (!user)
      return navigate("/login", { state: { from: `/providers/${id}` } });
    if (!date) return setNotice("Please select a booking date.");
    if (!service) return setNotice("This provider has no active services.");
    try {
      await api.createBooking({
        providerId: provider.id,
        serviceId: service._id,
        date,
        note,
      });
      setNotice("Booking request created. You can see it in My Bookings.");
      setNote("");
    } catch (e) {
      setNotice(e.message);
    }
  };
  if (error)
    return (
      <div className="container-wide py-20 text-center">
        <p className="font-bold text-red-600">{error}</p>
        <Link className="mt-4 inline-block text-blue-600" to="/providers">
          Back to providers
        </Link>
      </div>
    );
  if (!provider)
    return <div className="container-wide py-20 text-center">Loading...</div>;
  return (
    <div className="container-wide py-12">
      <Link to="/providers" className="text-sm font-bold text-blue-600">
        ← Back to providers
      </Link>
      <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_380px]">
        <section>
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="grid size-24 shrink-0 place-items-center rounded-3xl bg-blue-50 text-5xl">
                {provider.avatar}
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    {provider.category}
                  </span>
                  {provider.verified && (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <h1 className="mt-2 text-3xl font-black">{provider.name}</h1>
                <p className="mt-1 text-sm text-slate-500">
                  📍 {provider.location} ·{" "}
                  {provider.experience || "Professional"}
                </p>
                <p className="mt-2 font-bold">
                  ⭐ {provider.rating ? provider.rating.toFixed(1) : "New"}{" "}
                  <span className="font-normal text-slate-400">
                    {provider.reviews ? `from ${provider.reviews} reviews` : ""}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap items-start justify-between gap-4">
              <p className="leading-7 text-slate-600">{provider.description}</p>
              {user?.role === "customer" && (
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold"
                >
                  {isFavorite ? "♥ Saved" : "♡ Save provider"}
                </button>
              )}
            </div>
          </div>
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-black">Services & pricing</h2>
            <div className="mt-5 divide-y divide-slate-100">
              {services.map((s) => (
                <button
                  onClick={() => setSelected(s._id)}
                  key={s._id}
                  className={`flex w-full items-center justify-between gap-4 py-4 text-left ${selected === s._id ? "text-blue-600" : ""}`}
                >
                  <span>
                    <span className="block font-bold">{s.name}</span>
                    <span className="text-xs text-slate-400">per {s.unit}</span>
                  </span>
                  <span className="font-black">
                    {s.price.toLocaleString()} MMK
                  </span>
                </button>
              ))}
            </div>
            {!services.length && (
              <p className="py-6 text-sm text-slate-500">
                No active services yet.
              </p>
            )}
          </div>
        </section>
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-7 shadow-soft lg:sticky lg:top-24">
          <p className="text-sm font-bold text-blue-600">Book this provider</p>
          <h2 className="mt-1 text-2xl font-black">
            {service?.name || "Select a service"}
          </h2>
          <p className="mt-2 text-2xl font-black">
            {service ? `${service.price.toLocaleString()} MMK` : "—"}
          </p>
          <form onSubmit={book} className="mt-6 space-y-4">
            <label className="block text-sm font-bold">
              Preferred date
              <input
                required
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </label>
            <label className="block text-sm font-bold">
              Note (optional)
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows="3"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
              />
            </label>
            <button
              disabled={!service}
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white disabled:opacity-50"
            >
              Request booking
            </button>
          </form>
          {notice && (
            <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
              {notice}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
