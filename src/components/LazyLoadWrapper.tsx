
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyLoadWrapper = ({ children, fallback }: LazyLoadWrapperProps) => {
  const defaultFallback = (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default LazyLoadWrapper;
