import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await register(form);
    setLoading(false);
    if (!result.ok) return setError(result.message);
    navigate(result.user.role === "provider" ? "/provider" : "/dashboard", {
      replace: true,
    });
  };
  return (
    <div className="container-wide flex min-h-[680px] items-center justify-center py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Join ServiceBridge as a customer or service provider.
        </p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block text-sm font-bold">
            Full name
            <input
              required
              minLength="2"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>
          <label className="block text-sm font-bold">
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>
          <label className="block text-sm font-bold">
            Password
            <input
              required
              minLength="6"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>
          <div>
            <p className="text-sm font-bold">I want to...</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {[
                ["customer", "Find services"],
                ["provider", "Offer services"],
              ].map(([role, label]) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => update("role", role)}
                  className={`rounded-2xl border p-4 text-left ${form.role === role ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200"}`}
                >
                  <span className="block font-bold">{label}</span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {role === "customer"
                      ? "Book local professionals."
                      : "Build your provider profile."}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-blue-600">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
