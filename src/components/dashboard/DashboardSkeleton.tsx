
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const DashboardSkeleton = () => {
  return (
    <main className="max-w-7xl mx-auto pt-8 py-8 px-4 sm:px-6 bg-white">
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-2">
          <div className="text-lg font-medium text-gray-900">Loading your dashboard...</div>
          <div className="text-sm text-gray-500">Please wait while we fetch your data</div>
        </div>

        {/* Skeleton Cards Preview */}
        <div className="w-full max-w-4xl mt-8">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-12 w-full" />
                  <div className="flex justify-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="w-1.5 h-8 rounded-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full rounded" />
                    <Skeleton className="h-16 w-full rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-20 w-full rounded" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardSkeleton;
