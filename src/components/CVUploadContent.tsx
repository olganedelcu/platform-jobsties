
import React from 'react';
import { useCVUpload } from '@/hooks/useCVUpload';
import CVUploadForm from '@/components/CVUploadForm';
import CVMenteesList from '@/components/CVMenteesList';
import CVFilesList from '@/components/CVFilesList';
import ModuleFileUpload from '@/components/coach/ModuleFileUpload';

const CVUploadContent = () => {
  const {
    selectedMentee,
    setSelectedMentee,
    uploadingFile,
    mentees,
    cvFiles,
    loading,
    handleFileUpload,
    handleDeleteCV
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
        <h1 className="text-3xl font-bold text-gray-900">File Upload Management</h1>
        <p className="text-gray-600 mt-2">Upload and manage CV files and module resources for your mentees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CVUploadForm
          mentees={mentees}
          selectedMentee={selectedMentee}
          onMenteeSelect={setSelectedMentee}
          onFileUpload={handleFileUpload}
          uploadingFile={uploadingFile}
        />

        <ModuleFileUpload />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CVMenteesList mentees={mentees} />
      </div>

      <CVFilesList 
        cvFiles={cvFiles}
        onDeleteCV={handleDeleteCV}
      />
    </main>
  );
};

export default CVUploadContent;
