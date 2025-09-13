export default function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-xl border bg-white overflow-hidden">
        <div className="h-40 bg-gray-200" />
        <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-9 bg-gray-200 rounded w-28 mt-2" />
        </div>
        </div>
    )
}
