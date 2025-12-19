export default function BlogDetailLoading() {
  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 md:h-12 w-3/4 bg-slate-200 rounded animate-pulse" />
          <div className="h-6 w-1/2 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Cover image skeleton */}
        <div className="aspect-video bg-slate-200 rounded-xl animate-pulse" />

        {/* Content skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              {i % 3 === 0 ? (
                <div className="h-8 w-2/3 bg-slate-200 rounded animate-pulse" />
              ) : (
                <>
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

