import { Link } from "react-router-dom";
export default function ServiceCard({ category }) {
  return (
    <Link
      to={`/services?category=${encodeURIComponent(category.name)}`}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-soft"
    >
      <div className="grid size-12 place-items-center rounded-xl bg-slate-100 text-2xl transition group-hover:bg-blue-50">
        {category.icon || "🛠️"}
      </div>
      <h3 className="mt-4 font-extrabold">{category.name}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        {category.description}
      </p>
      <span className="mt-4 inline-block text-sm font-bold text-blue-600">
        Explore →
      </span>
    </Link>
  );
}
