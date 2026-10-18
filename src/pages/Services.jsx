import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib_api";
import { formatProvider } from "../lib_format";
import ProviderCard from "../components/ProviderCard";

export default function Services() {
  const [params] = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "All");
  const [query, setQuery] = useState(params.get("search") || "");
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { api.categories().then((r) => setCategories(r.categories || [])).catch((e) => setError(e.message)); }, []);
  useEffect(() => {
    setLoading(true);
    api.providers({ search: query, category: category === "All" ? "" : category, limit: 100 })
      .then((r) => setProviders((r.providers || []).map(formatProvider)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query, category]);

  return (
    <div className="container-wide py-12">
      <div className="max-w-3xl">
        <p className="font-bold text-blue-600">Service directory</p>
        <h1 className="mt-2 text-4xl font-black">Find the right service</h1>
        <p className="mt-3 text-slate-500">
          Search providers by category, location or name.
        </p>
      </div>
      <div className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services or providers..."
          className="rounded-xl bg-slate-50 px-4 py-3 outline-none ring-blue-200 focus:ring-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl bg-slate-50 px-4 py-3 outline-none"
        >
          <option>All</option>
          {categories.map((c) => (
            <option key={c._id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-8">
        <p className="text-sm text-slate-500">
          {loading
            ? "Loading..."
            : `${providers.length} provider${providers.length !== 1 ? "s" : ""} found`}
        </p>
      </div>
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
      {!loading && !providers.length && (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <p className="font-bold">No providers found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different category or search term.
          </p>
        </div>
      )}
    </div>
  );
}
