import { Link } from "react-router-dom";
export default function ProviderCard({ provider }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="flex items-start justify-between">
        <div className="grid size-14 place-items-center rounded-2xl bg-blue-50 text-3xl">
          {provider.avatar}
        </div>
        {provider.verified && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            ✓ Verified
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
          {provider.category}
        </p>
        <h3 className="mt-1 text-lg font-extrabold">{provider.name}</h3>
        <p className="mt-1 text-sm text-slate-500">
          📍 {provider.location} · {provider.experience || "Professional"}
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
          {provider.description}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm font-bold">
          ⭐ {provider.rating ? provider.rating.toFixed(1) : "New"}{" "}
          {provider.reviews ? (
            <span className="font-normal text-slate-400">
              ({provider.reviews})
            </span>
          ) : null}
        </span>
        <Link
          to={`/providers/${provider.id}`}
          className="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-bold text-white hover:bg-blue-600"
        >
          View profile
        </Link>
      </div>
    </article>
  );
}
