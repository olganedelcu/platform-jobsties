
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface CVFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size: number | null;
  uploaded_at: string;
  coach_name?: string;
}

interface CVFileItemProps {
  file: CVFile;
  onDownload: (filePath: string, fileName: string) => Promise<void>;
}

const CVFileItem = ({ file, onDownload }: CVFileItemProps) => {
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-red-100">
          <FileText className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{file.file_name}</p>
          <div className="flex flex-col sm:flex-row sm:items-center text-xs text-gray-500 gap-1 sm:gap-3">
            <span className="flex items-center">Uploaded by: {file.coach_name}</span>
            <span className="hidden sm:inline">•</span>
            <span>{formatFileSize(file.file_size)}</span>
            <span className="hidden sm:inline">•</span>
            <span>
              {format(new Date(file.uploaded_at), 'MMM d, yyyy')}
            </span>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDownload(file.file_url, file.file_name)}
        className="text-blue-600 hover:text-blue-700"
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </div>
  );
};

export default CVFileItem;
