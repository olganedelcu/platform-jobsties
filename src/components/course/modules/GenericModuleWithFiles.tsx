
import React from 'react';
import ModuleFiles from '@/components/ModuleFiles';

interface GenericModuleWithFilesProps {
  userId: string;
  moduleType: 'linkedin' | 'job_search_strategy' | 'interview_preparation';
  title: string;
  description: string;
}

const GenericModuleWithFiles = ({ userId, moduleType, title, description }: GenericModuleWithFilesProps) => {
  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        {description}
      </p>
      <ModuleFiles 
        userId={userId} 
        moduleType={moduleType} 
        title={title} 
      />
    </div>
  );
};

export default GenericModuleWithFiles;
