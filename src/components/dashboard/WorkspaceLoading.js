import { Skeleton } from "@/components/ui/Skeleton";

export default function WorkspaceLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-6 w-32 rounded-full bg-white/[0.06]" />
        <Skeleton className="h-10 w-80 rounded-2xl bg-white/[0.06]" />
        <Skeleton className="h-5 w-full max-w-2xl rounded-2xl bg-white/[0.06]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-3xl bg-white/[0.06]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-[320px] rounded-3xl bg-white/[0.06]" />
        <Skeleton className="h-[320px] rounded-3xl bg-white/[0.06]" />
      </div>
    </div>
  );
}
