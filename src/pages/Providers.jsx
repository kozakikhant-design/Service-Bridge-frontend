import { useEffect, useState } from "react";
import { api } from "../lib_api";
import { formatProvider } from "../lib_format";
import ProviderCard from "../components/ProviderCard";

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .providers({ limit: 100 })
      .then((r) => setProviders((r.providers || []).map(formatProvider)))
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div className="container-wide py-12">
      <p className="font-bold text-blue-600">Professionals</p>
      <h1 className="mt-2 text-4xl font-black">Meet our providers</h1>
      <p className="mt-3 max-w-2xl text-slate-500">
        Browse independent professionals and local businesses offering services
        through ServiceBridge.
      </p>
      {error && (
        <p className="mt-6 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
      {!providers.length && !error && (
        <p className="mt-8 text-slate-500">No providers have joined yet.</p>
      )}
    </div>
  );
}
