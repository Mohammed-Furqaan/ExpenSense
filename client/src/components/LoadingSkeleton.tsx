export function CardSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-1/3 mb-3"></div>
      <div className="h-8 bg-slate-700 rounded w-1/2"></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
      <div className="h-48 bg-slate-700 rounded"></div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="h-10 w-10 bg-slate-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-700 rounded w-1/3"></div>
        <div className="h-3 bg-slate-700 rounded w-1/4"></div>
      </div>
      <div className="h-6 bg-slate-700 rounded w-20"></div>
    </div>
  );
}
