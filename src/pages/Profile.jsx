import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib_api";
export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    avatar: user.avatar || "",
  });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  useEffect(
    () =>
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      }),
    [user],
  );
  const submit = async (e) => {
    e.preventDefault();
    try {
      const r = await api.updateUser(user._id, form);
      setUser(r.user);
      setNotice("Profile updated.");
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <div className="container-wide max-w-3xl py-12">
      <h1 className="text-4xl font-black">My profile</h1>
      <form
        onSubmit={submit}
        className="mt-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm space-y-5"
      >
        <label className="block text-sm font-bold">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block text-sm font-bold">
          Email
          <input
            disabled
            value={user.email}
            className="mt-2 w-full rounded-xl bg-slate-50 px-4 py-3 text-slate-500"
          />
        </label>
        <label className="block text-sm font-bold">
          Phone
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block text-sm font-bold">
          Avatar emoji
          <input
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
            placeholder="e.g. 👩‍🔧"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            {notice}
          </p>
        )}
        <button className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white">
          Save changes
        </button>
      </form>
    </div>
  );
}
