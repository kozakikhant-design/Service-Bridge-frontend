import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? "text-blue-600" : "text-slate-600 hover:text-blue-600"}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-wide flex h-18 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-black tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white">S</span>
          <span className="text-xl">Service<span className="text-blue-600">Bridge</span></span>
        </Link>

        <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-xl md:hidden" aria-label="Toggle menu">
          ☰
        </button>

        <nav className={`${open ? "absolute left-4 right-4 top-16 flex" : "hidden"} flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0 md:shadow-none`}>
          <NavLink onClick={() => setOpen(false)} to="/services" className={navClass}>Services</NavLink>
          <NavLink onClick={() => setOpen(false)} to="/providers" className={navClass}>Providers</NavLink>
          {user?.role === "customer" && <NavLink onClick={() => setOpen(false)} to="/bookings" className={navClass}>My Bookings</NavLink>}
          {user?.role === "provider" && <NavLink onClick={() => setOpen(false)} to="/provider" className={navClass}>Provider Dashboard</NavLink>}
          {user?.role === "admin" && <NavLink onClick={() => setOpen(false)} to="/admin" className={navClass}>Admin</NavLink>}

          <div className="hidden h-6 w-px bg-slate-200 md:block" />

          {user ? (
            <div className="flex items-center gap-3">
              <Link to={user.role === "customer" ? "/dashboard" : user.role === "provider" ? "/provider" : "/admin"} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold">
                {user.name}
              </Link>
              <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:text-red-700">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-slate-700">Login</Link>
              <Link to="/register" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700">Get Started</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}