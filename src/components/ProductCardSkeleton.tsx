import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-slate-800/90 border-slate-700">
      {/* Image skeleton */}
      <div className="h-32 sm:h-44 w-full skeleton-shimmer" />

      <CardHeader className="p-3 sm:p-4 pb-2">
        {/* Badge skeleton */}
        <div className="h-5 w-20 skeleton-shimmer rounded-full mb-2" />
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 skeleton-shimmer rounded w-3/4" />
          <div className="h-4 skeleton-shimmer rounded w-1/2" />
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 pt-0">
        {/* Price skeleton */}
        <div className="h-6 skeleton-shimmer rounded w-24 mb-2" />
        {/* Unit skeleton */}
        <div className="h-3 skeleton-shimmer rounded w-20" />
      </CardContent>
    </Card>
  );
}
