
import React from 'react';
import { Button } from '@/components/ui/button';
import MenteeCVFiles from '@/components/MenteeCVFiles';

interface CVOptimizationModuleProps {
  userId: string;
  moduleAction?: string | null;
}

const CVOptimizationModule = ({ userId, moduleAction }: CVOptimizationModuleProps) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        Your coach can upload CV files for you to review and download. These files will be available here once uploaded.
      </p>
      <MenteeCVFiles userId={userId} />
      {moduleAction && (
        <Button 
          className="mt-4 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          {moduleAction}
        </Button>
      )}
    </div>
  );
};

export default CVOptimizationModule;
