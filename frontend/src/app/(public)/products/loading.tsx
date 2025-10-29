export default function ProductsLoading() {
  return (
    <div className="container py-6 md:py-8">
      <div className="mb-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-80 bg-slate-200 rounded animate-pulse mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <aside className="md:col-span-3">
          <div className="rounded-lg border border-border bg-white p-4 md:p-5 space-y-5 animate-pulse">
            <div className="h-5 w-24 bg-slate-200 rounded" />
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 w-2/3 bg-slate-200 rounded" />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 bg-slate-200 rounded" />
              <div className="h-10 bg-slate-200 rounded" />
            </div>
            <div className="h-10 bg-slate-200 rounded" />
            <div className="h-10 bg-slate-200 rounded" />
          </div>
        </aside>

        <section className="md:col-span-9">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card h-full animate-pulse">
                <div className="aspect-square bg-slate-200 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-3/4 bg-slate-200 rounded" />
                  <div className="h-8 w-24 bg-slate-200 rounded" />
                  <div className="h-4 w-1/3 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
