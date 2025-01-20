import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    // <div className="animate-in fade-in duration-1000">Loading.........</div>
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
