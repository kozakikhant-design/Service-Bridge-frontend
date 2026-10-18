import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-wide grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-xl font-black">Service<span className="text-blue-600">Bridge</span></div>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
            A local services marketplace connecting customers with trusted service providers.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Explore</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-500">
            <Link to="/services">Services</Link>
            <Link to="/providers">Providers</Link>
            <Link to="/register">Become a provider</Link>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Project</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500">Frontend prototype built with React, Vite, JavaScript and Tailwind CSS.</p>
        </div>
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
        © 2026 ServiceBridge. Frontend prototype.
      </div>
    </footer>
  );
}