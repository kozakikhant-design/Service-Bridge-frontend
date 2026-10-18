import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-wide flex min-h-[600px] items-center justify-center text-center">
      <div>
        <p className="text-7xl font-black text-blue-600">404</p>
        <h1 className="mt-4 text-3xl font-black">Page not found</h1>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}