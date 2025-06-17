
import React from 'react';
import { useCVUpload } from '@/hooks/useCVUpload';
import CVMenteesList from '@/components/CVMenteesList';
import AllUploadedFilesList from '@/components/AllUploadedFilesList';
import ModuleFileUpload from '@/components/coach/ModuleFileUpload';

const CVUploadContent = () => {
  const {
    mentees,
    allFiles,
    loading,
    handleDeleteFile
  } = useCVUpload();

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-8 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ModuleFileUpload />
        <CVMenteesList mentees={mentees} />
      </div>

      <AllUploadedFilesList 
        files={allFiles}
        onDeleteFile={handleDeleteFile}
      />
    </main>
  );
};

export default CVUploadContent;
