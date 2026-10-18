import { useEffect, useState } from "react";
import { api } from "../lib_api";
import { formatProvider } from "../lib_format";
import ProviderCard from "../components/ProviderCard";
export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .favorites()
      .then((r) =>
        setFavorites(
          (r.favorites || []).map((f) => formatProvider(f.provider)),
        ),
      )
      .catch((e) => setError(e.message));
  }, []);
  return (
    <div className="container-wide py-12">
      <h1 className="text-4xl font-black">Saved providers</h1>
      <p className="mt-2 text-slate-500">Your favorite professionals.</p>
      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {favorites.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
      {!favorites.length && !error && (
        <p className="mt-8 text-slate-500">You have no saved providers yet.</p>
      )}
    </div>
  );
}
