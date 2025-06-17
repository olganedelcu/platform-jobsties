
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Document & File Management</h1>
        <p className="text-gray-600 mt-2">Upload module resources and manage CV files for your mentees</p>
      </div>

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
