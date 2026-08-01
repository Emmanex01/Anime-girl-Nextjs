'use client';

export default function CategoryFilterSkeleton({
  count = 8,
}: {
  count?: number;
}) {
  return (
    <div className="space-y-1">
      <div className="mb-3 h-3 w-40 skeleton rounded" />

      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-sm px-3 py-2"
        >
          <div
            className="skeleton h-3 rounded"
            style={{
              width: `${55 + (index % 4) * 10}%`,
            }}
          />

          <div className="skeleton h-2.5 w-2.5 rounded-full" />
        </div>
      ))}
    </div>
  );
}