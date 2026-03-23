export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div 
      className={`animate-pulse bg-white/5 rounded-lg ${className}`} 
      style={style}
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#161b27] rounded-xl p-5 border border-white/5">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-white/5">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-[#161b27] rounded-xl p-5 border border-white/5">
      <Skeleton className="h-4 w-32 mb-4" />
      <div className="flex items-end gap-2 h-32">
        {[60, 80, 45, 90, 70, 85, 95].map((h, i) => (
          <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}
