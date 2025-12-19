export default function BlogsLoading() {
  return (
    <div className="container py-12 md:py-16 space-y-8">
      <header className="space-y-3 mb-8">
        <div className="h-10 md:h-12 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-6 w-80 bg-slate-200 rounded animate-pulse" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 bg-white p-0 flex flex-col overflow-hidden animate-pulse">
            <div className="aspect-video bg-slate-200" />
            <div className="flex-1 space-y-3 p-5">
              <div className="h-6 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-200 rounded mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

