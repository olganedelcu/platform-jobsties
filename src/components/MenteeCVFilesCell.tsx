
import React from 'react';
import { FileText } from 'lucide-react';

interface CVFile {
  id: string;
  file_name: string;
  mentee_id: string;
}

interface MenteeCVFilesCellProps {
  cvFiles: CVFile[];
}

const MenteeCVFilesCell = ({ cvFiles }: MenteeCVFilesCellProps) => {
  return (
    <div className="flex items-center space-x-2">
      <FileText className="h-4 w-4 text-gray-400" />
      <span className="text-sm">{cvFiles.length} file{cvFiles.length !== 1 ? 's' : ''}</span>
    </div>
  );
};

export default MenteeCVFilesCell;
