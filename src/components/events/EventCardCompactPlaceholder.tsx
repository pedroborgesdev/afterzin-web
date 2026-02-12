/**
 * Placeholder visual igual ao EventCardCompact, mas sem informações.
 */
export function EventCardCompactPlaceholder() {
  return (
    <div className="group block w-[220px] sm:w-[260px] shrink-0 snap-start">
      <div className="rounded-xl sm:rounded-2xl overflow-hidden bg-card hover-lift h-full">
        {/* Image Placeholder */}
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          <div className="absolute inset-0 w-full h-full metallic-shine" />
          {/* Status Badge Placeholder */}
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex gap-1.5">
            <div className="w-8 h-4 rounded bg-muted-foreground/20" />
          </div>
        </div>
        {/* Content Placeholder */}
        <div className="p-2.5 sm:p-3">
          <div className="h-4 w-3/4 bg-muted-foreground/20 rounded mb-2" />
          <div className="flex flex-col gap-0.5 text-[11px] sm:text-xs text-muted-foreground mb-2">
            <div className="h-3 w-12 bg-muted-foreground/20 rounded" />
            <div className="h-3 w-16 bg-muted-foreground/20 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="h-3 w-10 bg-muted-foreground/20 rounded mb-1" />
              <div className="h-4 w-16 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
