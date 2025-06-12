
import React from 'react';

const CVFilesLoadingState = () => {
  return (
    <div className="text-center py-4">
      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
      <p className="text-sm text-gray-600 mt-2">Loading CV files...</p>
    </div>
  );
};

export default CVFilesLoadingState;
