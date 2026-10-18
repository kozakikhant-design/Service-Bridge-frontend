import { useEffect, useState } from "react";
import { api } from "../lib_api";
export default function ProviderServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "service",
    description: "",
  });
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const load = () =>
    api
      .myProvider()
      .then((r) => api.services({ provider: r.provider._id }))
      .then((r) => setServices(r.services || []));
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing)
        await api.updateService(editing, {
          ...form,
          price: Number(form.price),
        });
      else await api.createService({ ...form, price: Number(form.price) });
      setForm({ name: "", price: "", unit: "service", description: "" });
      setEditing(null);
      setError("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Remove this service?")) return;
    try {
      await api.deleteService(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const edit = (s) => {
    setEditing(s._id);
    setForm({
      name: s.name,
      price: s.price,
      unit: s.unit,
      description: s.description || "",
    });
  };
  return (
    <div className="container-wide py-12">
      <h1 className="text-4xl font-black">Manage services</h1>
      <p className="mt-2 text-slate-500">
      Manage your services and track their admin approval status.
      Only approved services are visible to customers.
    </p>
      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-black">Your services</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {services.map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p className="text-xs text-slate-400">
                  per {s.unit}
                  {s.description ? ` · ${s.description}` : ""}
                  </p>

                    <p
                    className={`mt-2 text-xs font-bold ${
                        s.reviewStatus === "approved"
                        ? "text-green-600"
                        : s.reviewStatus === "rejected"
                        ? "text-red-600"
                        : "text-amber-600"
                  }`}
>
                      Status: {s.reviewStatus || "pending"}
                    </p>

                  {s.reviewStatus === "rejected" && s.rejectionReason && (
                  <p className="mt-1 text-xs text-red-600">
                   Reason: {s.rejectionReason}
                </p>
                    )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-black">{s.price.toLocaleString()} MMK</p>
                  <button
                    onClick={() => edit(s)}
                    className="text-sm font-bold text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(s._id)}
                    className="text-sm font-bold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {!services.length && (
              <p className="py-8 text-sm text-slate-500">
                No services yet. Add your first service.
              </p>
            )}
          </div>
        </section>
        <form
          onSubmit={submit}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-6"
        >
          <h2 className="font-black">
            {editing ? "Edit service" : "Add service"}
          </h2>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Service name"
            className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
          <input
            required
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            type="number"
            placeholder="Price (MMK)"
            className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
          <input
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
            placeholder="Unit (service, hour, visit...)"
            className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            rows="3"
            className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
          <button className="mt-4 w-full rounded-xl bg-blue-600 py-3 font-bold text-white">
            {editing ? "Save service" : "Add service"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm({
                  name: "",
                  price: "",
                  unit: "service",
                  description: "",
                });
              }}
              className="mt-2 w-full rounded-xl border py-3 font-bold"
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
