import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (!result.ok) return setError(result.message);
    navigate(
      location.state?.from ||
        (result.user.role === "provider"
          ? "/provider"
          : result.user.role === "admin"
            ? "/admin"
            : "/dashboard"),
      { replace: true },
    );
  };
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your ServiceBridge account."
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
        />
        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}
        <button
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New here?{" "}
        <Link to="/register" className="font-bold text-blue-600">
          Register here
        </Link>
      </p>
    </AuthShell>
  );
}
function Field({ label, type, value, onChange }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}
function AuthShell({ title, subtitle, children }) {
  return (
    <div className="container-wide flex min-h-[680px] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-7 text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-blue-600 font-black text-white">
            S
          </div>
          <h1 className="mt-5 text-3xl font-black">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
