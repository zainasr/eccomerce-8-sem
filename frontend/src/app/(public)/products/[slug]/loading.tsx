export default function ProductDetailLoading() {
  return (
    <div className="container py-10 md:py-16">
      {/* Breadcrumb skeleton */}
      <div className="mb-8">
        <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image skeleton */}
        <section className="space-y-5">
          <div className="aspect-square bg-slate-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </section>

        {/* Info skeleton */}
        <section className="space-y-8">
          <div className="space-y-4">
            <div className="h-10 md:h-12 w-3/4 bg-slate-200 rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="border-t border-b border-border/50 py-8">
            <div className="h-12 w-48 bg-slate-200 rounded animate-pulse mb-3" />
            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
          </div>

          <div className="space-y-3">
            <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="h-12 w-full bg-slate-200 rounded animate-pulse" />
        </section>
      </div>
    </div>
  );
}

