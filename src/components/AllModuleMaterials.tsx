
import React from 'react';
import ModuleFiles from '@/components/ModuleFiles';

interface AllModuleMaterialsProps {
  userId: string;
}

const AllModuleMaterials = ({ userId }: AllModuleMaterialsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Module Materials</h3>
        <p className="text-gray-600 mb-6">
          Access all files and materials that have been shared by your coach across different modules.
        </p>
      </div>
      
      <div className="space-y-6">
        <ModuleFiles 
          userId={userId} 
          moduleType="linkedin" 
          title="LinkedIn & Cover Letter" 
        />
        <ModuleFiles 
          userId={userId} 
          moduleType="job_search_strategy" 
          title="Job Search Strategy" 
        />
        <ModuleFiles 
          userId={userId} 
          moduleType="interview_preparation" 
          title="Interview Preparation" 
        />
      </div>
    </div>
  );
};

export default AllModuleMaterials;
