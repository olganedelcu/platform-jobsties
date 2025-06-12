
import React from 'react';
import { FileText } from 'lucide-react';

const CVFilesEmptyState = () => {
  return (
    <div className="text-center py-8">
      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No CV files available yet</h3>
      <p className="text-gray-500">Your coach will upload them here once they're ready</p>
    </div>
  );
};

export default CVFilesEmptyState;
