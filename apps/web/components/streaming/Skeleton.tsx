"use client";

import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-md bg-surface-elevated", className)}
    />
  );
}

export function StreamCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="flex gap-2.5">
        <Skeleton className="size-9 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return <Skeleton className="aspect-[3/4] w-[140px] shrink-0 rounded-xl sm:w-[160px]" />;
}

export function FeaturedStreamSkeleton() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <Skeleton className="aspect-video flex-1 rounded-xl" />
      <Skeleton className="hidden h-auto w-full rounded-xl lg:block lg:w-[320px] xl:w-[360px]" />
    </div>
  );
}
