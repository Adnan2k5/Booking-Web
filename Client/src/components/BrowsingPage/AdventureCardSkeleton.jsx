import { Skeleton } from "../ui/skeleton"

export function AdventureCardSkeleton() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-md">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <div className="flex justify-between mt-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  )
}
