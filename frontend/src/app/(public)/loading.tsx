export default function PublicLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-br from-blue-50 via-white to-sky-50 py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="h-12 md:h-16 w-2/3 mx-auto bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-1/2 mx-auto bg-slate-200 rounded animate-pulse" />
            <div className="h-12 w-40 mx-auto bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </section>
      <section className="bg-surface">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-white p-6 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-slate-200 mx-auto mb-3" />
                <div className="h-4 w-20 bg-slate-200 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="container py-10">
          <div className="flex justify-between items-center mb-12">
            <div className="h-8 w-56 bg-slate-200 rounded animate-pulse" />
            <div className="h-9 w-28 bg-slate-200 rounded animate-pulse hidden md:block" />
          </div>
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
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
      </section>
    </div>
  );
}
