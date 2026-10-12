import React from 'react';

export interface LoadingSkeletonProps {
  rows?: number;
  height?: string;
  width?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 1,
  height,
  width,
  className = '',
}) => {
  if (height || width) {
    return (
      <div
        className={`rounded-xl bg-slate-800/50 border border-slate-700/30 animate-pulse ${className}`}
        style={{ height: height || '50px', width: width || '100%' }}
      />
    );
  }

  return (
    <div className={`space-y-3 w-full animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-14 rounded-lg bg-slate-800/50 border border-slate-700/30 w-full" />
      ))}
    </div>
  );
};
