import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../lib_api";
import { formatProvider } from "../lib_format";
import ServiceCard from "../components/ServiceCard";
import ProviderCard from "../components/ProviderCard";

export default function Home() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.categories(), api.providers({ limit: 6 })])
      .then(([cats, providerData]) => {
        setCategories(cats.categories || []);
        setProviders((providerData.providers || []).map(formatProvider));
      })
      .catch((e) => setError(e.message));
  }, []);

  return <>
    <section className="hero-grid overflow-hidden border-b border-slate-200">
      <div className="container-wide grid min-h-[650px] items-center gap-12 py-16 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">🇲🇲 Local services, made simpler</div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">Find trusted people for the <span className="gradient-text">job you need.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">Discover tutors, technicians, cleaners, photographers, drivers and other local professionals in one place.</p>
          <form className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft sm:flex-row" onSubmit={(e) => { e.preventDefault(); window.location.href = `/services?search=${encodeURIComponent(query)}`; }}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 rounded-xl px-4 py-3 outline-none placeholder:text-slate-400" placeholder="What service are you looking for?" />
            <button className="rounded-xl bg-blue-600 px-7 py-3 font-bold text-white hover:bg-blue-700">Search</button>
          </form>
          <div className="mt-7 flex flex-wrap gap-2 text-sm text-slate-500"><span>Popular:</span>{categories.slice(0, 3).map((x) => <Link key={x._id} to={`/services?category=${encodeURIComponent(x.name)}`} className="font-semibold text-blue-600 hover:underline">{x.name}</Link>)}</div>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -inset-6 rounded-[40px] bg-blue-100/50 blur-2xl" />
          <div className="relative rounded-[32px] border border-slate-200 bg-white p-7 shadow-soft">
            <div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-slate-400">Live directory</p><h2 className="text-2xl font-black">Popular providers</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">● Live</span></div>
            <div className="mt-6 space-y-3">{providers.slice(0, 3).map((p) => <Link to={`/providers/${p.id}`} key={p.id} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 hover:bg-blue-50"><span className="grid size-12 place-items-center rounded-xl bg-white text-2xl">{p.avatar}</span><div className="min-w-0 flex-1"><p className="truncate font-bold">{p.name}</p><p className="text-sm text-slate-500">{p.category} · {p.location}</p></div><span className="font-bold">⭐ {p.rating || "—"}</span></Link>)}</div>
            {!providers.length && <p className="mt-6 text-sm text-slate-500">No providers are available yet.</p>}
          </div>
        </div>
      </div>
    </section>
    <section className="container-wide py-20">
      <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-blue-600">Explore</p><h2 className="mt-2 text-3xl font-black">Popular services</h2></div><Link to="/services" className="hidden text-sm font-bold text-blue-600 sm:block">View all →</Link></div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((c) => <ServiceCard key={c._id} category={c} />)}</div>
      {!categories.length && <p className="mt-6 text-sm text-slate-500">{error || "No categories available yet."}</p>}
    </section>
    <section className="bg-white py-20"><div className="container-wide"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-blue-600">Trusted professionals</p><h2 className="mt-2 text-3xl font-black">Featured providers</h2></div><Link to="/providers" className="text-sm font-bold text-blue-600">View all →</Link></div><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{providers.slice(0, 3).map((p) => <ProviderCard key={p.id} provider={p} />)}</div></div></section>
    <section className="container-wide py-20"><div className="rounded-[32px] bg-slate-900 p-8 text-white sm:p-12"><div className="max-w-2xl"><p className="font-bold text-blue-300">For service providers</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Turn your skills into new customers.</h2><p className="mt-4 leading-7 text-slate-300">Create a professional profile, list your services and let customers find you.</p><Link to="/register" className="mt-7 inline-block rounded-xl bg-white px-5 py-3 font-bold text-slate-900">Become a provider</Link></div></div></section>
  </>;
}
