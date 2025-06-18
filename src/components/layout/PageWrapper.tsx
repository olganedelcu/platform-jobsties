
import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageWrapperProps {
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const PageWrapper = ({ loading, children, className = "pt-20" }: PageWrapperProps) => {
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${className}`}>
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default PageWrapper;
