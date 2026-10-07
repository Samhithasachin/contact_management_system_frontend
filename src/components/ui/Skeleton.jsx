import clsx from "clsx";

export function Skeleton({ className }) {
  return <div className={clsx("bg-shimmer rounded-md", className)} />;
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-ink-100 px-6 py-4">
      <Skeleton className="size-9 rounded-full" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="ml-auto h-4 w-28" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}
