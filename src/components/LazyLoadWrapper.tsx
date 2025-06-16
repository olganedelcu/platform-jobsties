
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minHeight?: string;
}

const LazyLoadWrapper = ({ 
  children, 
  fallback,
  minHeight = '200px'
}: LazyLoadWrapperProps) => {
  const defaultFallback = (
    <div 
      className="flex items-center justify-center w-full"
      style={{ minHeight }}
    >
      <div className="flex items-center">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default LazyLoadWrapper;
