import { cn } from '@/utils/cn';

const Loading = ({ className, rows = 3, type = 'card' }) => {
  const SkeletonRow = ({ className }) => (
    <div className={cn("animate-pulse", className)}>
      <div className="h-4 bg-gray-200 rounded shimmer mb-2"></div>
      <div className="h-3 bg-gray-200 rounded shimmer w-3/4"></div>
    </div>
  );

  const SkeletonCard = ({ className }) => (
    <div className={cn("animate-pulse bg-white rounded-xl p-6 shadow-sm border border-gray-200", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded shimmer w-1/3"></div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg shimmer"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded shimmer mb-2"></div>
      <div className="h-4 bg-gray-200 rounded shimmer w-2/3"></div>
    </div>
  );

  const SkeletonTable = ({ className }) => (
    <div className={cn("animate-pulse bg-white rounded-xl shadow-sm border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded shimmer w-1/4"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="p-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full shimmer"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded shimmer w-24"></div>
                <div className="h-3 bg-gray-200 rounded shimmer w-16"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-6 bg-gray-200 rounded-full shimmer w-20"></div>
              <div className="h-4 bg-gray-200 rounded shimmer w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (type === 'card') {
    return (
      <div className={cn("grid gap-6", className)}>
        {Array.from({ length: rows }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return <SkeletonTable className={className} />;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </div>
  );
};

export default Loading;