
import React from 'react';
import ModuleFiles from '@/components/ModuleFiles';

interface GenericModuleWithFilesProps {
  userId: string;
  moduleType: 'cv_optimization' | 'linkedin' | 'job_search_strategy' | 'interview_preparation' | 'feedback';
  title: string;
  description: string;
}

const GenericModuleWithFiles = ({ userId, moduleType, title, description }: GenericModuleWithFilesProps) => {
  return (
    <div className="space-y-6">
      <ModuleFiles 
        userId={userId} 
        moduleType={moduleType} 
        title={title} 
      />
    </div>
  );
};

export default GenericModuleWithFiles;
