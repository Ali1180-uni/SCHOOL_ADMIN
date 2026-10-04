export default function ModulePage({ title }) {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-[#17324d]">{title}</h1>
      <div className="rounded-xl border border-[#e1e8e1] bg-white p-6 text-[#6b7d87] shadow-sm">
        {title} module coming next.
      </div>
    </div>
  );
}
