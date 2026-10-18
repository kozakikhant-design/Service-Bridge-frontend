export default function StatCard({ icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-xl">{icon}</span>
        <span className="text-xs font-semibold text-slate-400">{detail}</span>
      </div>
      <p className="mt-5 text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}