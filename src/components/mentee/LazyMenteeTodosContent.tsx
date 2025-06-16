
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const MenteeTodosTabsContent = React.lazy(() => import('./MenteeTodosTabsContent'));

interface LazyMenteeTodosContentProps {
  userId: string;
}

const LazyMenteeTodosContent = ({ userId }: LazyMenteeTodosContentProps) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your tasks...</p>
          </div>
        </div>
      }
    >
      <MenteeTodosTabsContent userId={userId} />
    </Suspense>
  );
};

export default LazyMenteeTodosContent;
