export default function Loading() {
  return (
    <div className="container py-6 md:py-8">
      <div className="h-8 w-48 rounded bg-slate-200 animate-pulse mb-2" />
      <div className="h-4 w-72 rounded bg-slate-200 animate-pulse mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="card h-full animate-pulse">
            <div className="aspect-square bg-slate-200 rounded-t-xl" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-8 w-24 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
